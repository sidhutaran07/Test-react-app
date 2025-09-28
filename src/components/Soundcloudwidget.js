// Draggable + Resizable SoundCloud widget (with Widget API + Track picker + Monaco config)
// Deps:
//   npm i react-draggable re-resizable @monaco-editor/react monaco-editor
// .env example:
//   VITE_SOUNDCLOUD_URL=https://soundcloud.com/artist/track

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Draggable from "react-draggable";
import { Resizable } from "re-resizable";
import Editor from "@monaco-editor/react";

// Optional: swap with your shadcn Button if you prefer
const Btn = ({ children, onClick, title, className = "", disabled }) => (
  <button
    onClick={onClick}
    title={title}
    disabled={disabled}
    className={`rounded border px-2 py-1 text-xs hover:bg-accent disabled:opacity-50 ${className}`}
    type="button"
  >
    {children}
  </button>
);

function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {
      /* ignore quota errors */
    }
  }, [key, val]);

  return [val, setVal];
}

function useScript(src) {
  useEffect(() => {
    if (document.querySelector(`script[src="${src}"]`)) return;
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    document.head.appendChild(s);
    return () => {};
  }, [src]);
}

function normalizeTrackUrl(value) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

// IMPORTANT: SoundCloud expects hex color WITHOUT the leading '#'
function normalizeColor(value) {
  if (typeof value !== "string") return "ff5500";
  const hex = value.trim().replace(/^#/, "");
  return hex || "ff5500";
}

function clampVolume(value, fallback = 50) {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(100, Math.max(0, Math.round(num)));
}

export default function DraggableSoundCloudWidget({
  id = "soundcloud-1",
  defaultPos = { x: 24, y: 24 },
  defaultSize = { width: 380, height: 220 },
  initialTrackUrl = import.meta.env.VITE_SOUNDCLOUD_URL,
}) {
  useScript("https://w.soundcloud.com/player/api.js");

  const nodeRef = useRef(null);
  const iframeRef = useRef(null);
  const widgetRef = useRef(null); // SC.Widget instance

  const [pos, setPos] = useLocalStorage(`sc-pos:${id}`, defaultPos);
  const [size, setSize] = useLocalStorage(`sc-size:${id}`, defaultSize);
  const [minimized, setMinimized] = useLocalStorage(`sc-min:${id}`, false);
  const [config, setConfig] = useLocalStorage(`sc-cfg:${id}`, {
    auto_play: false,
    show_comments: true,
    show_user: true,
    visual: false,
    color: "ff5500", // stored without '#'
    volume: 50,
  });
  const [trackUrl, setTrackUrl] = useLocalStorage(
    `sc-url:${id}`,
    normalizeTrackUrl(initialTrackUrl)
  );

  const sanitizedTrackUrl = useMemo(() => normalizeTrackUrl(trackUrl), [trackUrl]);
  const hasTrack = Boolean(sanitizedTrackUrl);
  const volume = useMemo(() => clampVolume(config.volume, 50), [config.volume]);

  // playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  const embedSrc = useMemo(() => {
    if (!sanitizedTrackUrl) return "";
    const base = "https://w.soundcloud.com/player/";
    const qp = new URLSearchParams({
      url: sanitizedTrackUrl,
      auto_play: String(Boolean(config.auto_play)),
      hide_related: "false",
      show_comments: String(Boolean(config.show_comments)),
      show_user: String(Boolean(config.show_user)),
      show_reposts: "false",
      visual: String(Boolean(config.visual)),
      color: normalizeColor(config.color), // <— no '#'
      buying: "false",
      sharing: "true",
      download: "false",
    });
    return `${base}?${qp.toString()}`;
  }, [
    sanitizedTrackUrl,
    config.auto_play,
    config.show_comments,
    config.show_user,
    config.visual,
    config.color,
  ]);

  // Initialize SC.Widget once the script + iframe are ready
  useEffect(() => {
    if (!embedSrc) {
      widgetRef.current = null;
      setIsPlaying(false);
      setDuration(0);
      setPosition(0);
      return undefined;
    }

    let tries = 0;
    const timer = setInterval(() => {
      if (window.SC?.Widget && iframeRef.current) {
        const w = (widgetRef.current = window.SC.Widget(iframeRef.current));
        w.bind(window.SC.Widget.Events.READY, () => {
          w.setVolume(volume);
          w.getDuration((ms) => setDuration(ms || 0));
          w.isPaused((paused) => setIsPlaying(!paused));
        });
        w.bind(window.SC.Widget.Events.PLAY, () => setIsPlaying(true));
        w.bind(window.SC.Widget.Events.PAUSE, () => setIsPlaying(false));
        w.bind(window.SC.Widget.Events.PLAY_PROGRESS, (e) => {
          setPosition(e.currentPosition || 0);
        });
        clearInterval(timer);
      } else if (++tries > 50) {
        clearInterval(timer); // ~10s timeout at 200ms
      }
    }, 200);

    return () => clearInterval(timer);
  }, [embedSrc, volume]);

  const play = useCallback(() => widgetRef.current?.play(), []);
  const pause = useCallback(() => widgetRef.current?.pause(), []);
  const seek = useCallback((ms) => widgetRef.current?.seekTo(ms), []);
  const setVol = useCallback((v) => widgetRef.current?.setVolume(v), []);

  const onStop = (_e, data) => setPos({ x: data.x, y: data.y });

  const [showPicker, setShowPicker] = useState(false);
  const [draftUrl, setDraftUrl] = useState(trackUrl);

  useEffect(() => {
    if (showPicker) {
      setDraftUrl(trackUrl);
    }
  }, [showPicker, trackUrl]);

  const handleSaveTrack = useCallback(() => {
    const normalized = normalizeTrackUrl(draftUrl);
    setTrackUrl(normalized);
    setShowPicker(false);
  }, [draftUrl, setTrackUrl]);

  const [showConfig, setShowConfig] = useState(false);
  const [draftCfg, setDraftCfg] = useState(JSON.stringify(config, null, 2));

  useEffect(() => {
    if (showConfig) {
      setDraftCfg(JSON.stringify(config, null, 2));
    }
  }, [showConfig, config]);

  const totalSecs = Math.max(0, Math.round(duration / 1000));
  const posSecs = Math.max(0, Math.round(position / 1000));

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".sc-handle"
      defaultPosition={pos}
      position={pos}
      onStop={onStop}
      bounds="body"
    >
      <div
        ref={nodeRef}
        className="fixed z-50 rounded-xl border bg-background/90 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/70"
      >
        <Resizable
          size={{ width: size.width, height: minimized ? undefined : size.height }}
          onResizeStop={(_e, _dir, _el, d) =>
            setSize({ width: size.width + d.width, height: size.height + d.height })
          }
          minWidth={300}
          minHeight={140}
          enable={{ right: true, bottom: true, bottomRight: true }}
        >
          <div className="sc-handle flex cursor-move items-center justify-between gap-2 rounded-t-xl border-b bg-muted/50 px-3 py-2">
            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate text-sm font-medium">SoundCloud Player</span>
              {hasTrack && (
                <a
                  href={sanitizedTrackUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate text-xs underline"
                >
                  open
                </a>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Btn onClick={() => setShowPicker(true)}>Track</Btn>
              <Btn onClick={() => setShowConfig(true)}>Config</Btn>
              <Btn onClick={() => setMinimized((s) => !s)}>{minimized ? "Expand" : "Minimize"}</Btn>
            </div>
          </div>

          {!minimized && (
            <div className="flex flex-col gap-2 p-2">
              {hasTrack ? (
                <iframe
                  key={embedSrc}
                  ref={iframeRef}
                  title="SoundCloud player"
                  width="100%"
                  height={config.visual ? 320 : 140}
                  scrolling="no"
                  frameBorder="no"
                  allow="autoplay; encrypted-media"
                  src={embedSrc}
                  className="rounded-md"
                />
              ) : (
                <div className="flex min-h-[120px] items-center justify-center rounded-md border border-dashed border-neutral-300 bg-white/70 p-3 text-xs text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900/70 dark:text-neutral-400">
                  Set a SoundCloud track to start playing.
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                {isPlaying ? (
                  <Btn onClick={pause}>Pause</Btn>
                ) : (
                  <Btn onClick={play} disabled={!hasTrack}>
                    Play
                  </Btn>
                )}

                <div className="flex items-center gap-2 text-xs">
                  <span>{posSecs}s</span>
                  <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    value={position}
                    onChange={(e) => seek(Number(e.target.value))}
                    className="h-2 w-48"
                    disabled={!hasTrack}
                  />
                  <span>{totalSecs}s</span>
                </div>

                <div className="ml-auto flex items-center gap-2 text-xs">
                  <span>Vol</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={volume}
                    onChange={(e) => {
                      const v = clampVolume(e.target.value, volume);
                      setConfig({ ...config, volume: v });
                      setVol(v);
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </Resizable>

        {showPicker && (
          <div
            className="fixed inset-0 z-[60] grid place-items-center bg-black/30 p-4"
            onClick={() => setShowPicker(false)}
          >
            <div
              className="w-full max-w-md rounded-lg border bg-background p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-2 text-lg font-semibold">Set SoundCloud track URL</div>
              <input
                className="mb-3 w-full rounded border px-2 py-1 text-sm"
                placeholder="https://soundcloud.com/artist/track"
                value={draftUrl}
                onChange={(e) => setDraftUrl(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Btn onClick={() => setShowPicker(false)}>Cancel</Btn>
                <Btn onClick={handleSaveTrack}>Save</Btn>
              </div>
            </div>
          </div>
        )}

        {showConfig && (
          <div
            className="fixed inset-0 z-[60] grid place-items-center bg-black/30 p-4"
            onClick={() => setShowConfig(false)}
          >
            <div
              className="w-full max-w-2xl rounded-lg border bg-background p-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="text-lg font-semibold">Advanced Config (JSON)</div>
                <Btn onClick={() => setShowConfig(false)}>Close</Btn>
              </div>
              <div className="h-[320px] overflow-hidden rounded">
                <Editor
                  height="100%"
                  defaultLanguage="json"
                  value={draftCfg}
                  onChange={(v) => setDraftCfg(v ?? "")}
                  options={{ minimap: { enabled: false }, fontSize: 13 }}
                />
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <Btn onClick={() => setDraftCfg(JSON.stringify(config, null, 2))}>Reset</Btn>
                <Btn
                  onClick={() => {
                    try {
                      const next = JSON.parse(draftCfg || "{}");
                      const safeVolume = clampVolume(next.volume ?? volume, volume);
                      setConfig({
                        ...config,
                        ...next,
                        color: normalizeColor(next.color ?? config.color),
                        volume: safeVolume,
                      });
                      setShowConfig(false);
                    } catch {
                      alert("Invalid JSON");
                    }
                  }}
                >
                  Apply
                </Btn>
              </div>
            </div>
          </div>
        )}
      </div>
    </Draggable>
  );
}

// Usage example:
// <DraggableSoundCloudWidget id="sc-global" />
