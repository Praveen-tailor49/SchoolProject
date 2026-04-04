"use client";

import { useCallback, useEffect, useState } from "react";
import { formatClassLabel } from "@/lib/class-format";
import {
  btnDanger,
  btnGhost,
  btnPrimary,
  inputCls,
  labelCls,
  panelCls,
} from "./ui-styles";

type ClassRow = {
  id: string;
  grade: number;
  section: string;
  stream: string | null;
  createdAt: string;
};

export function ClassesManager() {
  const [rows, setRows] = useState<ClassRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [grade, setGrade] = useState(1);
  const [section, setSection] = useState("");
  const [stream, setStream] = useState<"" | "science" | "commerce" | "arts">(
    "",
  );

  const [editId, setEditId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const res = await fetch("/api/classes");
    const data = (await res.json()) as { classes?: ClassRow[]; error?: string };
    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Failed to load");
      return;
    }
    setRows(data.classes ?? []);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      await load();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  function resetForm() {
    setGrade(1);
    setSection("");
    setStream("");
    setEditId(null);
  }

  function startEdit(row: ClassRow) {
    setEditId(row.id);
    setGrade(row.grade);
    setSection(row.section);
    setStream(
      (row.stream as "science" | "commerce" | "arts" | null) ?? "",
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const body = {
        grade,
        section: section.trim(),
        stream: stream === "" ? null : stream,
      };
      const res = await fetch(
        editId ? `/api/classes/${editId}` : "/api/classes",
        {
          method: editId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Save failed");
        return;
      }
      resetForm();
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this class? Students or teachers linked to it must be updated first.")) {
      return;
    }
    setError(null);
    const res = await fetch(`/api/classes/${id}`, { method: "DELETE" });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Delete failed");
      return;
    }
    if (editId === id) resetForm();
    await load();
  }

  return (
    <div className="space-y-8">
      <section className={panelCls}>
        <h2 className="font-display text-xl text-ink">
          {editId ? "Edit class" : "Add class"}
        </h2>
        <form onSubmit={onSubmit} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className={labelCls} htmlFor="grade">
              Grade (1–12)
            </label>
            <input
              id="grade"
              type="number"
              min={1}
              max={12}
              required
              className={`${inputCls} mt-1`}
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value))}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="section">
              Section
            </label>
            <input
              id="section"
              required
              className={`${inputCls} mt-1`}
              value={section}
              onChange={(e) => setSection(e.target.value)}
              placeholder="A"
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="stream">
              Stream
            </label>
            <select
              id="stream"
              className={`${inputCls} mt-1`}
              value={stream}
              onChange={(e) =>
                setStream(
                  e.target.value as "" | "science" | "commerce" | "arts",
                )
              }
            >
              <option value="">None</option>
              <option value="science">Science</option>
              <option value="commerce">Commerce</option>
              <option value="arts">Arts</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button type="submit" disabled={saving} className={btnPrimary}>
              {saving ? "Saving…" : editId ? "Update" : "Add class"}
            </button>
            {editId ? (
              <button type="button" className={btnGhost} onClick={resetForm}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </section>

      {error ? (
        <p className="rounded-md border border-clay/40 bg-clay/10 px-3 py-2 text-sm" role="alert">
          {error}
        </p>
      ) : null}

      <section className={panelCls}>
        <h2 className="font-display text-xl text-ink">All classes</h2>
        {loading ? (
          <p className="mt-4 text-sm text-ink-muted">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="mt-4 text-sm text-ink-muted">No classes yet. Add one above.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-left text-xs text-ink-muted uppercase tracking-wide">
                  <th className="pb-2 pr-4">Class</th>
                  <th className="pb-2 pr-4">Stream</th>
                  <th className="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-ink/5">
                    <td className="py-3 pr-4 font-medium">
                      {formatClassLabel({
                        grade: r.grade,
                        section: r.section,
                        stream: r.stream,
                      })}
                    </td>
                    <td className="py-3 pr-4 text-ink-muted">
                      {r.stream ?? "—"}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        className={`${btnGhost} mr-2`}
                        onClick={() => startEdit(r)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className={btnDanger}
                        onClick={() => void onDelete(r.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
