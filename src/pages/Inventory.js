import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Table, THead, TBody, TR, TH, TD } from "../components/ui/Table";


function RowEditor({ row, onChange, onRemove }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
      <div className="sm:col-span-4">
        <Label>Item Category</Label>
        <Input
          placeholder="e.g., Books"
          value={row.category}
          onChange={(e) => onChange({ ...row, category: e.target.value })}
        />
      </div>
      <div className="sm:col-span-5">
        <Label>Item Name</Label>
        <Input
          placeholder="Ikigai"
          value={row.name}
          onChange={(e) => onChange({ ...row, name: e.target.value })}
        />
      </div>
      <div className="sm:col-span-2">
        <Label>Price</Label>
        <Input
          type="number"
          min="0"
          step="0.01"
          placeholder="499"
          value={row.price}
          onChange={(e) => onChange({ ...row, price: e.target.value })}
        />
      </div>
      <div className="sm:col-span-1 flex items-end">
        <Button variant="ghost" className="w-full" onClick={onRemove} title="Remove row">
          ✕
        </Button>
      </div>
    </div>
  );
}

export default function Inventory() {
  // rows to add
  const [rows, setRows] = useState([{ category: "", name: "", price: "" }]);
  // existing items
  const [items, setItems] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const totalToAdd = useMemo(
    () =>
      rows
        .map((r) => parseFloat(r.price || 0))
        .filter((n) => !Number.isNaN(n))
        .reduce((a, b) => a + b, 0),
    [rows]
  );

  async function fetchItems() {
    setLoadingList(true);
    try {
      const res = await fetch(`${API}/api/items`);
      const json = await res.json();
      setItems(json);
    } catch {
      // ignore for brevity
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  function updateRow(idx, next) {
    setRows((r) => r.map((x, i) => (i === idx ? next : x)));
  }
  function addRow() {
    setRows((r) => [...r, { category: "", name: "", price: "" }]);
  }
  function removeRow(idx) {
    setRows((r) => r.filter((_, i) => i !== idx));
  }

  async function saveAll(e) {
    e.preventDefault();
    setError("");
    // basic validation
    const ready = rows
      .map((r) => ({
        category: r.category.trim(),
        name: r.name.trim(),
        price: Number(r.price),
      }))
      .filter((r) => r.category && r.name && !Number.isNaN(r.price) && r.price >= 0);

    if (ready.length === 0) {
      setError("Fill at least one valid row (category, name, price ≥ 0).");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch(`${API}/api/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ready),
      });
      if (!res.ok) throw new Error("Save failed");
      setRows([{ category: "", name: "", price: "" }]);
      await fetchItems();
    } catch (e) {
      setError(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(id) {
    try {
      await fetch(`${API}/api/items/${id}`, { method: "DELETE" });
      await fetchItems();
    } catch {}
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div className="text-lg font-bold">Inventory Micro-SaaS</div>
          <div className="text-sm text-neutral-500">React · shadcn/ui-style · Express · MongoDB</div>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-6 px-5 py-6 md:grid-cols-12">
        {/* Entry form */}
        <section className="md:col-span-12">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Add Items</h2>
                <div className="text-sm text-neutral-500">Total (to add): ₹{totalToAdd.toFixed(2)}</div>
              </div>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={saveAll}>
                {rows.map((row, i) => (
                  <RowEditor
                    key={i}
                    row={row}
                    onChange={(next) => updateRow(i, next)}
                    onRemove={() => removeRow(i)}
                  />
                ))}

                <div className="flex items-center gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={addRow}>+ Add another</Button>
                  <Button type="submit" className="px-4" disabled={saving}>
                    {saving ? "Saving..." : "Save entries"}
                  </Button>
                  {error && <div className="text-sm text-red-600">{error}</div>}
                </div>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* List */}
        <section className="md:col-span-12">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Items</h2>
                <div className="text-sm text-neutral-500">{loadingList ? "Loading…" : `${items.length} total`}</div>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <THead>
                  <TR>
                    <TH>Category</TH>
                    <TH>Name</TH>
                    <TH className="text-right">Price (₹)</TH>
                    <TH className="w-[70px]"></TH>
                  </TR>
                </THead>
                <TBody>
                  {items.map((it) => (
                    <TR key={it._id}>
                      <TD>{it.category}</TD>
                      <TD>{it.name}</TD>
                      <TD className="text-right">{Number(it.price).toFixed(2)}</TD>
                      <TD className="text-right">
                        <Button variant="ghost" onClick={() => deleteItem(it._id)}>🗑️</Button>
                      </TD>
                    </TR>
                  ))}
                  {items.length === 0 && !loadingList && (
                    <TR><TD colSpan={4} className="py-6 text-center text-neutral-500">No items yet.</TD></TR>
                  )}
                </TBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-5xl px-5 py-4 text-sm text-neutral-500">
          © {new Date().getFullYear()} Inventory
        </div>
      </footer>
    </div>
  );
}
