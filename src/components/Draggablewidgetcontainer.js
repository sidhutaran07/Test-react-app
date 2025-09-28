import { Children, useCallback, useEffect, useMemo, useState } from "react";
import { Rnd } from "react-rnd";
import { ChevronLeft, ChevronRight, GripVertical, X } from "lucide-react";

// Config
const MIN_W = 240;
const MIN_H = 200;
const DEF_W = 320;
const DEF_H = 240;

// Small helper to persist/restore any state
function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {}
  }, [key, val]);
  return [val, setVal];
}

/**
 * DraggableWidgetBoard
 * - Provides a collapsible sidebar to toggle widgets.
 * - Renders any opened child as a draggable + resizable window.
 * - Maintains z-order so the focused item moves to front.
 * - Saves/loads layout to localStorage so positions persist across refresh.
 *
 * Props:
 * - children: ReactNode[] - each child becomes a widget
 * - storageKey?: string - key for localStorage
 * - bounds?: "window" | "parent" - drag bounds (default "window")
 */
export default function DraggableWidgetBoard({
  children,
  storageKey = "widget-board:v1",
  bounds = "window",
}) {
  const normalizedChildren = useMemo(() => Children.toArray(children), [children]);

  // initial layout for each widget
  const initial = useMemo(() => {
    const margin = 24;
    return normalizedChildren.map((_, i) => ({
      id: `widget-${i}`,
      x: margin + (i % 3) * (DEF_W + margin),
      y: margin + Math.floor(i / 3) * (DEF_H + margin),
      width: DEF_W,
      height: DEF_H,
      z: i + 1,
    }));
  }, [normalizedChildren]);

  const [layout, setLayout] = useLocalStorage(storageKey, initial);
  const [sidebarOpen, setSidebarOpen] = useLocalStorage(
    `${storageKey}:sidebar-open`,
    true
  );
  const [openIds, setOpenIds] = useLocalStorage(
    `${storageKey}:open`,
    initial[0]?.id ? [initial[0].id] : []
  );

  const [zTop, setZTop] = useState(() =>
    layout?.length ? Math.max(...layout.map(l => l.z || 1)) : 1
  );

  useEffect(() => {
    setLayout(prev => {
      const validIds = normalizedChildren.map((_, i) => `widget-${i}`);
      if (!validIds.length) {
        setZTop(1);
        return prev.length ? [] : prev;
      }
      const needsUpdate =
        prev.length !== validIds.length ||
        prev.some(item => !validIds.includes(item.id));
      if (!needsUpdate) {
        return prev;
      }

      const next = validIds.map((id, i) => {
        const fallback = initial[i];
        const existing = prev.find(item => item.id === id);
        return existing
          ? { ...fallback, ...existing, id }
          : { ...fallback, id };
      });
      setZTop(next.length ? Math.max(...next.map(l => l.z || 1)) : 1);
      return next;
    });
  }, [normalizedChildren, initial, setLayout]);

  useEffect(() => {
    const validIds = normalizedChildren.map((_, i) => `widget-${i}`);
    setOpenIds(prev => {
      const filtered = prev.filter(id => validIds.includes(id));
      if (filtered.length === prev.length) {
        return prev;
      }
      if (!filtered.length && prev.length) {
        return validIds.length ? [validIds[0]] : [];
      }
      return filtered;
    });
  }, [normalizedChildren, setOpenIds]);

  const bringToFront = useCallback(
    (id) => {
      setLayout(prev => {
        if (!prev.length) return prev;
        const top = Math.max(...prev.map(p => p.z || 1), zTop);
        const nextTop = top + 1;
        setZTop(nextTop);
        return prev.map(p => (p.id === id ? { ...p, z: nextTop } : p));
      });
    },
    [zTop, setLayout]
  );

  const updatePos = useCallback(
    (id, x, y) => {
      setLayout(prev => prev.map(p => (p.id === id ? { ...p, x, y } : p)));
    },
    [setLayout]
  );

  const updateSize = useCallback(
    (id, width, height) => {
      setLayout(prev => prev.map(p => (p.id === id ? { ...p, width, height } : p)));
    },
    [setLayout]
  );

  const handleToggle = useCallback(
    (id) => {
      setOpenIds(prev => {
        const isOpen = prev.includes(id);
        if (isOpen) {
          return prev.filter(openId => openId !== id);
        }
        bringToFront(id);
        return [...prev, id];
      });
    },
    [bringToFront, setOpenIds]
  );

  const handleClose = useCallback(
    (id) => {
      setOpenIds(prev => prev.filter(openId => openId !== id));
    },
    [setOpenIds]
  );

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, [setSidebarOpen]);

  const openWidgets = useMemo(() => {
    return openIds
      .map(id => {
        const idx = normalizedChildren.findIndex((_, i) => `widget-${i}` === id);
        if (idx === -1) return null;
        const child = normalizedChildren[idx];
        const fallback = initial[idx];
        const itemLayout = layout.find(l => l.id === id) ?? fallback;
        if (!child || !itemLayout) return null;
        return { id, child, idx, fallback, itemLayout };
      })
      .filter(Boolean);
  }, [openIds, normalizedChildren, layout, initial]);

  return (
    <div className="flex w-full gap-4">
      <aside
        className={`flex flex-shrink-0 flex-col transition-all duration-300 ${
          sidebarOpen ? "w-60" : "w-14"
        }`}
      >
        <div className="flex h-full flex-col rounded-xl border border-black/10 bg-white/80 p-2 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-900/80">
          <button
            type="button"
            onClick={toggleSidebar}
            className="flex items-center justify-center gap-2 rounded-lg border border-transparent px-3 py-2 text-sm font-semibold text-neutral-700 transition hover:border-black/10 hover:bg-black/10 hover:text-neutral-900 dark:text-neutral-200 dark:hover:border-white/10 dark:hover:bg-white/10 dark:hover:text-white"
          >
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            {sidebarOpen && <span>Widgets</span>}
          </button>
          <div
            className={`mt-3 flex-1 overflow-y-auto transition-opacity duration-200 ${
              sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <div className="flex flex-col gap-2">
              {normalizedChildren.map((child, idx) => {
                const id = `widget-${idx}`;
                const isOpen = openIds.includes(id);
                const label =
                  child?.props?.widgetTitle ??
                  child?.props?.title ??
                  child?.type?.widgetTitle ??
                  child?.type?.displayName ??
                  child?.type?.name ??
                  `Widget ${idx + 1}`;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleToggle(id)}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                      isOpen
                        ? "bg-indigo-500 text-white shadow"
                        : "text-neutral-700 hover:bg-neutral-200/70 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    }`}
                    aria-pressed={isOpen}
                  >
                    <span className="truncate">{label}</span>
                    {isOpen && <span className="ml-2 text-xs uppercase tracking-wide">open</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </aside>

      <div className="relative flex-1 min-h-[360px]">
        {openWidgets.length ? (
          openWidgets.map(({ id, child, idx, fallback, itemLayout }) => {
            const x = typeof itemLayout.x === "number" ? itemLayout.x : fallback?.x ?? 24;
            const y = typeof itemLayout.y === "number" ? itemLayout.y : fallback?.y ?? 24;
            const width = typeof itemLayout.width === "number" ? itemLayout.width : fallback?.width ?? DEF_W;
            const height = typeof itemLayout.height === "number" ? itemLayout.height : fallback?.height ?? DEF_H;
            const zIndex = itemLayout?.z ?? idx + 1;

            return (
              <Rnd
                key={id}
                default={{
                  x,
                  y,
                  width,
                  height,
                }}
                position={{ x, y }}
                size={{ width, height }}
                minWidth={MIN_W}
                minHeight={MIN_H}
                bounds={bounds}
                enableResizing={{
                  top: false,
                  right: true,
                  bottom: true,
                  left: false,
                  topRight: false,
                  bottomRight: true,
                  bottomLeft: false,
                  topLeft: false,
                }}
                dragHandleClassName={`drag-handle-${id}`}
                onDragStart={() => bringToFront(id)}
                onDragStop={(_e, d) => updatePos(id, Math.round(d.x), Math.round(d.y))}
                onResizeStart={() => bringToFront(id)}
                onResizeStop={(_e, _dir, ref, _delta, pos) => {
                  updateSize(id, Math.round(ref.offsetWidth), Math.round(ref.offsetHeight));
                  updatePos(id, Math.round(pos.x), Math.round(pos.y));
                }}
                style={{
                  zIndex,
                  position: bounds === "window" ? "fixed" : "absolute",
                  boxShadow: "0 8px 24px rgba(0,0,0,.08)",
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,.08)",
                  background: "var(--widget-bg, rgba(255,255,255,.9))",
                  backdropFilter: "saturate(140%) blur(6px)",
                }}
              >
                <div className="flex h-full w-full flex-col overflow-hidden rounded-[12px] bg-white/90 dark:bg-neutral-900/90">
                  <div
                    className={`drag-handle-${id} flex items-center justify-between gap-2 border-b border-black/10 bg-black/5 px-3 py-2 text-xs text-neutral-600 dark:border-white/10 dark:bg-white/5`}
                    style={{ cursor: "move", userSelect: "none" }}
                    onMouseDown={() => bringToFront(id)}
                    onPointerDown={() => bringToFront(id)}
                  >
                    <span className="inline-flex items-center gap-1 font-semibold">
                      <GripVertical className="h-4 w-4 opacity-60" />
                      {child?.props?.widgetTitle ??
                        child?.props?.title ??
                        child?.type?.widgetTitle ??
                        child?.type?.displayName ??
                        child?.type?.name ??
                        "Widget"}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="opacity-50">drag to move - drag corner to resize</span>
                      <button
                        type="button"
                        onMouseDown={event => event.stopPropagation()}
                        onPointerDown={event => event.stopPropagation()}
                        onClick={event => {
                          event.stopPropagation();
                          handleClose(id);
                        }}
                        className="rounded-md p-1 text-neutral-500 transition hover:bg-black/10 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white"
                        aria-label="Close widget"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-auto p-3">
                    {child}
                  </div>
                </div>
              </Rnd>
            );
          })
        ) : (
          <div className="flex min-h-[240px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
            <b>Select a widget from the sidebar to open it</b>
          </div>
        )}
      </div>
    </div>
  );
}
