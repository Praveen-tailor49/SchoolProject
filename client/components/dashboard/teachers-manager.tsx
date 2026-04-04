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

type ClassOption = {
  id: string;
  grade: number;
  section: string;
  stream: string | null;
};

type TeacherRow = {
  id: string;
  name: string;
  email: string;
  assignedClassId: string | null;
  createdAt: string;
  homeroomGrade: number | null;
  homeroomSection: string | null;
  homeroomStream: string | null;
};

export function TeachersManager() {
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [classOptions, setClassOptions] = useState<ClassOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [assignedClassId, setAssignedClassId] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const [tRes, cRes] = await Promise.all([
      fetch("/api/teachers"),
      fetch("/api/classes"),
    ]);
    const tData = (await tRes.json()) as {
      teachers?: TeacherRow[];
      error?: string;
    };
    const cData = (await cRes.json()) as {
      classes?: ClassOption[];
      error?: string;
    };
    if (!tRes.ok) {
      setError(typeof tData.error === "string" ? tData.error : "Failed to load teachers");
      return;
    }
    if (!cRes.ok) {
      setError(typeof cData.error === "string" ? cData.error : "Failed to load classes");
      return;
    }
    setTeachers(tData.teachers ?? []);
    setClassOptions(cData.classes ?? []);
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
    setName("");
    setEmail("");
    setAssignedClassId("");
    setEditId(null);
  }

  function startEdit(row: TeacherRow) {
    setEditId(row.id);
    setName(row.name);
    setEmail(row.email);
    setAssignedClassId(row.assignedClassId ?? "");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const body = {
        name: name.trim(),
        email: email.trim(),
        assignedClassId:
          assignedClassId === "" ? null : assignedClassId,
      };
      const res = await fetch(
        editId ? `/api/teachers/${editId}` : "/api/teachers",
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
    if (!confirm("Remove this teacher?")) return;
    setError(null);
    const res = await fetch(`/api/teachers/${id}`, { method: "DELETE" });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Delete failed");
      return;
    }
    if (editId === id) resetForm();
    await load();
  }

  function homeroomLabel(row: TeacherRow): string {
    if (
      row.homeroomGrade == null ||
      row.homeroomSection == null
    ) {
      return "—";
    }
    return formatClassLabel({
      grade: row.homeroomGrade,
      section: row.homeroomSection,
      stream: row.homeroomStream,
    });
  }

  return (
    <div className="space-y-8">
      <section className={panelCls}>
        <h2 className="font-display text-xl text-ink">
          {editId ? "Edit teacher" : "Add teacher"}
        </h2>
        <form onSubmit={onSubmit} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="t-name">
              Name
            </label>
            <input
              id="t-name"
              required
              className={`${inputCls} mt-1`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="t-email">
              Email
            </label>
            <input
              id="t-email"
              type="email"
              required
              className={`${inputCls} mt-1`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="t-class">
              Homeroom class
            </label>
            <select
              id="t-class"
              className={`${inputCls} mt-1`}
              value={assignedClassId}
              onChange={(e) => setAssignedClassId(e.target.value)}
            >
              <option value="">None</option>
              {classOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {formatClassLabel({
                    grade: c.grade,
                    section: c.section,
                    stream: c.stream,
                  })}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2 sm:col-span-2">
            <button type="submit" disabled={saving} className={btnPrimary}>
              {saving ? "Saving…" : editId ? "Update" : "Add teacher"}
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
        <h2 className="font-display text-xl text-ink">Teachers</h2>
        {loading ? (
          <p className="mt-4 text-sm text-ink-muted">Loading…</p>
        ) : teachers.length === 0 ? (
          <p className="mt-4 text-sm text-ink-muted">No teachers yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-left text-xs text-ink-muted uppercase tracking-wide">
                  <th className="pb-2 pr-4">Name</th>
                  <th className="pb-2 pr-4">Email</th>
                  <th className="pb-2 pr-4">Homeroom</th>
                  <th className="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((r) => (
                  <tr key={r.id} className="border-b border-ink/5">
                    <td className="py-3 pr-4 font-medium">{r.name}</td>
                    <td className="py-3 pr-4 text-ink-muted">{r.email}</td>
                    <td className="py-3 pr-4">{homeroomLabel(r)}</td>
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
