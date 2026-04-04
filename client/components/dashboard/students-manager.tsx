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

type StudentRow = {
  id: string;
  name: string;
  dob: string;
  rollNumber: number;
  classId: string;
  createdAt: string;
  grade: number;
  section: string;
  stream: string | null;
};

export function StudentsManager() {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [classOptions, setClassOptions] = useState<ClassOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [rollNumber, setRollNumber] = useState(1);
  const [classId, setClassId] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const [sRes, cRes] = await Promise.all([
      fetch("/api/students"),
      fetch("/api/classes"),
    ]);
    const sData = (await sRes.json()) as {
      students?: StudentRow[];
      error?: string;
    };
    const cData = (await cRes.json()) as {
      classes?: ClassOption[];
      error?: string;
    };
    if (!sRes.ok) {
      setError(typeof sData.error === "string" ? sData.error : "Failed to load students");
      return;
    }
    if (!cRes.ok) {
      setError(typeof cData.error === "string" ? cData.error : "Failed to load classes");
      return;
    }
    const cls = cData.classes ?? [];
    setStudents(sData.students ?? []);
    setClassOptions(cls);
    setClassId((prev) =>
      prev && cls.some((c) => c.id === prev) ? prev : (cls[0]?.id ?? ""),
    );
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
    setDob("");
    setRollNumber(1);
    setClassId(classOptions[0]?.id ?? "");
    setEditId(null);
  }

  function startEdit(row: StudentRow) {
    setEditId(row.id);
    setName(row.name);
    setDob(row.dob.slice(0, 10));
    setRollNumber(row.rollNumber);
    setClassId(row.classId);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!classId) {
      setError("Create a class first.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const body = {
        name: name.trim(),
        dob,
        rollNumber,
        classId,
      };
      const res = await fetch(
        editId ? `/api/students/${editId}` : "/api/students",
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
    if (!confirm("Remove this student?")) return;
    setError(null);
    const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
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
          {editId ? "Edit student" : "Add student"}
        </h2>
        <form onSubmit={onSubmit} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="s-name">
              Name
            </label>
            <input
              id="s-name"
              required
              className={`${inputCls} mt-1`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="s-dob">
              Date of birth
            </label>
            <input
              id="s-dob"
              type="date"
              required
              className={`${inputCls} mt-1`}
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="s-roll">
              Roll number
            </label>
            <input
              id="s-roll"
              type="number"
              min={1}
              required
              className={`${inputCls} mt-1`}
              value={rollNumber}
              onChange={(e) => setRollNumber(Number(e.target.value))}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="s-class">
              Class
            </label>
            <select
              id="s-class"
              required
              className={`${inputCls} mt-1`}
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
            >
              {classOptions.length === 0 ? (
                <option value="">No classes — add one first</option>
              ) : null}
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
          <div className="flex items-end gap-2 lg:col-span-5">
            <button
              type="submit"
              disabled={saving || classOptions.length === 0}
              className={btnPrimary}
            >
              {saving ? "Saving…" : editId ? "Update" : "Add student"}
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
        <h2 className="font-display text-xl text-ink">Students</h2>
        {loading ? (
          <p className="mt-4 text-sm text-ink-muted">Loading…</p>
        ) : students.length === 0 ? (
          <p className="mt-4 text-sm text-ink-muted">No students yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[44rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-left text-xs text-ink-muted uppercase tracking-wide">
                  <th className="pb-2 pr-4">Name</th>
                  <th className="pb-2 pr-4">Class</th>
                  <th className="pb-2 pr-4">Roll</th>
                  <th className="pb-2 pr-4">DOB</th>
                  <th className="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((r) => (
                  <tr key={r.id} className="border-b border-ink/5">
                    <td className="py-3 pr-4 font-medium">{r.name}</td>
                    <td className="py-3 pr-4">
                      {formatClassLabel({
                        grade: r.grade,
                        section: r.section,
                        stream: r.stream,
                      })}
                    </td>
                    <td className="py-3 pr-4">{r.rollNumber}</td>
                    <td className="py-3 pr-4 text-ink-muted">
                      {r.dob.slice(0, 10)}
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
