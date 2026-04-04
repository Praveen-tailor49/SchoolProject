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

type FeeStructureRow = {
  id: string;
  classId: string;
  amount: number;
  frequency: string;
  createdAt: string;
  grade: number;
  section: string;
  stream: string | null;
};

type StudentOption = {
  id: string;
  name: string;
  rollNumber: number;
  grade: number;
  section: string;
  stream: string | null;
};

type StudentFeeRow = {
  id: string;
  studentId: string;
  feeStructureId: string;
  amountDue: number;
  amountPaid: number;
  status: string;
  dueDate: string;
  createdAt: string;
  studentName: string;
  rollNumber: number;
  classGrade: number;
  classSection: string;
  classStream: string | null;
  feeAmount: number;
  feeFrequency: string;
};

const fmtMoney = (n: number) =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);

export function FeesManager() {
  const [structures, setStructures] = useState<FeeStructureRow[]>([]);
  const [studentFees, setStudentFees] = useState<StudentFeeRow[]>([]);
  const [classOptions, setClassOptions] = useState<ClassOption[]>([]);
  const [studentOptions, setStudentOptions] = useState<StudentOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingStruct, setSavingStruct] = useState(false);
  const [savingFee, setSavingFee] = useState(false);

  const [fsClassId, setFsClassId] = useState("");
  const [fsAmount, setFsAmount] = useState(0);
  const [fsFrequency, setFsFrequency] = useState<
    "monthly" | "quarterly" | "yearly"
  >("yearly");
  const [editStructId, setEditStructId] = useState<string | null>(null);

  const [sfStudentId, setSfStudentId] = useState("");
  const [sfStructureId, setSfStructureId] = useState("");
  const [sfDue, setSfDue] = useState(0);
  const [sfPaid, setSfPaid] = useState(0);
  const [sfDueDate, setSfDueDate] = useState("");
  const [editFeeId, setEditFeeId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const [fsRes, sfRes, cRes, stRes] = await Promise.all([
      fetch("/api/fee-structures"),
      fetch("/api/student-fees"),
      fetch("/api/classes"),
      fetch("/api/students"),
    ]);
    const fsData = (await fsRes.json()) as {
      feeStructures?: FeeStructureRow[];
      error?: string;
    };
    const sfData = (await sfRes.json()) as {
      studentFees?: StudentFeeRow[];
      error?: string;
    };
    const cData = (await cRes.json()) as {
      classes?: ClassOption[];
      error?: string;
    };
    const stData = (await stRes.json()) as {
      students?: StudentOption[];
      error?: string;
    };
    if (!fsRes.ok) {
      setError(typeof fsData.error === "string" ? fsData.error : "Load failed");
      return;
    }
    if (!sfRes.ok) {
      setError(typeof sfData.error === "string" ? sfData.error : "Load failed");
      return;
    }
    if (!cRes.ok || !stRes.ok) {
      setError("Could not load reference data");
      return;
    }
    const cls = cData.classes ?? [];
    const studs = stData.students ?? [];
    const fss = fsData.feeStructures ?? [];
    setStructures(fss);
    setStudentFees(sfData.studentFees ?? []);
    setClassOptions(cls);
    setStudentOptions(studs);

    setFsClassId((prev) =>
      prev && cls.some((c) => c.id === prev) ? prev : (cls[0]?.id ?? ""),
    );
    setSfStudentId((prev) =>
      prev && studs.some((s) => s.id === prev) ? prev : (studs[0]?.id ?? ""),
    );
    setSfStructureId((prev) =>
      prev && fss.some((f) => f.id === prev) ? prev : (fss[0]?.id ?? ""),
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

  function resetStructForm() {
    setFsAmount(0);
    setFsFrequency("yearly");
    setEditStructId(null);
    setFsClassId((prev) => prev || classOptions[0]?.id || "");
  }

  function startEditStruct(row: FeeStructureRow) {
    setEditStructId(row.id);
    setFsClassId(row.classId);
    setFsAmount(row.amount);
    setFsFrequency(row.frequency as "monthly" | "quarterly" | "yearly");
  }

  async function onSubmitStruct(e: React.FormEvent) {
    e.preventDefault();
    if (!fsClassId) {
      setError("Add a class first.");
      return;
    }
    setSavingStruct(true);
    setError(null);
    try {
      const res = await fetch(
        editStructId
          ? `/api/fee-structures/${editStructId}`
          : "/api/fee-structures",
        {
          method: editStructId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            classId: fsClassId,
            amount: fsAmount,
            frequency: fsFrequency,
          }),
        },
      );
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Save failed");
        return;
      }
      resetStructForm();
      await load();
    } finally {
      setSavingStruct(false);
    }
  }

  async function onDeleteStruct(id: string) {
    if (!confirm("Delete this fee structure?")) return;
    setError(null);
    const res = await fetch(`/api/fee-structures/${id}`, { method: "DELETE" });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Delete failed");
      return;
    }
    if (editStructId === id) resetStructForm();
    await load();
  }

  function resetFeeForm() {
    setSfDue(0);
    setSfPaid(0);
    setSfDueDate("");
    setEditFeeId(null);
    setSfStudentId((prev) => prev || studentOptions[0]?.id || "");
    setSfStructureId((prev) => prev || structures[0]?.id || "");
  }

  function startEditFee(row: StudentFeeRow) {
    setEditFeeId(row.id);
    setSfStudentId(row.studentId);
    setSfStructureId(row.feeStructureId);
    setSfDue(row.amountDue);
    setSfPaid(row.amountPaid);
    setSfDueDate(row.dueDate.slice(0, 10));
  }

  async function onSubmitFee(e: React.FormEvent) {
    e.preventDefault();
    if (!sfStudentId || !sfStructureId || !sfDueDate) {
      setError("Fill student, fee template, and due date.");
      return;
    }
    setSavingFee(true);
    setError(null);
    try {
      const res = await fetch(
        editFeeId ? `/api/student-fees/${editFeeId}` : "/api/student-fees",
        {
          method: editFeeId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            editFeeId
              ? {
                  amountDue: sfDue,
                  amountPaid: sfPaid,
                  dueDate: sfDueDate,
                }
              : {
                  studentId: sfStudentId,
                  feeStructureId: sfStructureId,
                  amountDue: sfDue,
                  amountPaid: sfPaid,
                  dueDate: sfDueDate,
                },
          ),
        },
      );
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Save failed");
        return;
      }
      resetFeeForm();
      await load();
    } finally {
      setSavingFee(false);
    }
  }

  async function onDeleteFee(id: string) {
    if (!confirm("Delete this fee record?")) return;
    setError(null);
    const res = await fetch(`/api/student-fees/${id}`, { method: "DELETE" });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Delete failed");
      return;
    }
    if (editFeeId === id) resetFeeForm();
    await load();
  }

  function statusBadge(status: string) {
    const base =
      "inline-block rounded-full px-2 py-0.5 text-xs font-semibold capitalize";
    if (status === "paid") return `${base} bg-forest/15 text-forest`;
    if (status === "partial") return `${base} bg-clay/15 text-clay`;
    return `${base} bg-ink/10 text-ink-muted`;
  }

  return (
    <div className="space-y-10">
      {error ? (
        <p className="rounded-md border border-clay/40 bg-clay/10 px-3 py-2 text-sm" role="alert">
          {error}
        </p>
      ) : null}

      <section className={panelCls}>
        <h2 className="font-display text-xl text-ink">Fee templates (per class)</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Default fee amount and billing cadence for a class. Use these when opening student fee
          records.
        </p>
        <form
          onSubmit={onSubmitStruct}
          className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
        >
          <div className="lg:col-span-2">
            <label className={labelCls}>Class</label>
            <select
              className={`${inputCls} mt-1`}
              value={fsClassId}
              onChange={(e) => setFsClassId(e.target.value)}
              disabled={classOptions.length === 0}
            >
              {classOptions.length === 0 ? (
                <option value="">No classes</option>
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
          <div>
            <label className={labelCls}>Amount</label>
            <input
              type="number"
              min={0}
              required
              className={`${inputCls} mt-1`}
              value={fsAmount}
              onChange={(e) => setFsAmount(Number(e.target.value))}
            />
          </div>
          <div>
            <label className={labelCls}>Frequency</label>
            <select
              className={`${inputCls} mt-1`}
              value={fsFrequency}
              onChange={(e) =>
                setFsFrequency(
                  e.target.value as "monthly" | "quarterly" | "yearly",
                )
              }
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button
              type="submit"
              disabled={savingStruct || classOptions.length === 0}
              className={btnPrimary}
            >
              {savingStruct ? "Saving…" : editStructId ? "Update" : "Add template"}
            </button>
            {editStructId ? (
              <button type="button" className={btnGhost} onClick={resetStructForm}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        {loading ? (
          <p className="mt-6 text-sm text-ink-muted">Loading…</p>
        ) : structures.length === 0 ? (
          <p className="mt-6 text-sm text-ink-muted">No fee templates yet.</p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-left text-xs text-ink-muted uppercase tracking-wide">
                  <th className="pb-2 pr-4">Class</th>
                  <th className="pb-2 pr-4">Amount</th>
                  <th className="pb-2 pr-4">Frequency</th>
                  <th className="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {structures.map((r) => (
                  <tr key={r.id} className="border-b border-ink/5">
                    <td className="py-3 pr-4 font-medium">
                      {formatClassLabel({
                        grade: r.grade,
                        section: r.section,
                        stream: r.stream,
                      })}
                    </td>
                    <td className="py-3 pr-4">{fmtMoney(r.amount)}</td>
                    <td className="py-3 pr-4 capitalize">{r.frequency}</td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        className={`${btnGhost} mr-2`}
                        onClick={() => startEditStruct(r)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className={btnDanger}
                        onClick={() => void onDeleteStruct(r.id)}
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

      <section className={panelCls}>
        <h2 className="font-display text-xl text-ink">Student fee records</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Track what each student owes and has paid. Status updates when you change amounts.
        </p>
        <form
          onSubmit={onSubmitFee}
          className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-6"
        >
          {!editFeeId ? (
            <>
              <div className="lg:col-span-2">
                <label className={labelCls}>Student</label>
                <select
                  className={`${inputCls} mt-1`}
                  value={sfStudentId}
                  onChange={(e) => setSfStudentId(e.target.value)}
                  disabled={studentOptions.length === 0}
                >
                  {studentOptions.length === 0 ? (
                    <option value="">No students</option>
                  ) : null}
                  {studentOptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} · roll {s.rollNumber} ·{" "}
                      {formatClassLabel({
                        grade: s.grade,
                        section: s.section,
                        stream: s.stream,
                      })}
                    </option>
                  ))}
                </select>
              </div>
              <div className="lg:col-span-2">
                <label className={labelCls}>Fee template</label>
                <select
                  className={`${inputCls} mt-1`}
                  value={sfStructureId}
                  onChange={(e) => setSfStructureId(e.target.value)}
                  disabled={structures.length === 0}
                >
                  {structures.length === 0 ? (
                    <option value="">Add a template first</option>
                  ) : null}
                  {structures.map((f) => (
                    <option key={f.id} value={f.id}>
                      {formatClassLabel({
                        grade: f.grade,
                        section: f.section,
                        stream: f.stream,
                      })}{" "}
                      · {fmtMoney(f.amount)} / {f.frequency}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <p className="text-sm text-ink-muted lg:col-span-4">
              Editing record — student and template are fixed; adjust amounts and due date.
            </p>
          )}
          <div>
            <label className={labelCls}>Amount due</label>
            <input
              type="number"
              min={0}
              required
              className={`${inputCls} mt-1`}
              value={sfDue}
              onChange={(e) => setSfDue(Number(e.target.value))}
            />
          </div>
          <div>
            <label className={labelCls}>Amount paid</label>
            <input
              type="number"
              min={0}
              required
              className={`${inputCls} mt-1`}
              value={sfPaid}
              onChange={(e) => setSfPaid(Number(e.target.value))}
            />
          </div>
          <div>
            <label className={labelCls}>Due date</label>
            <input
              type="date"
              required
              className={`${inputCls} mt-1`}
              value={sfDueDate}
              onChange={(e) => setSfDueDate(e.target.value)}
            />
          </div>
          <div className="flex items-end gap-2 lg:col-span-6">
            <button
              type="submit"
              disabled={
                savingFee ||
                (editFeeId
                  ? false
                  : studentOptions.length === 0 || structures.length === 0)
              }
              className={btnPrimary}
            >
              {savingFee ? "Saving…" : editFeeId ? "Update record" : "Add record"}
            </button>
            {editFeeId ? (
              <button type="button" className={btnGhost} onClick={resetFeeForm}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        {loading ? null : studentFees.length === 0 ? (
          <p className="mt-6 text-sm text-ink-muted">No student fee rows yet.</p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[52rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-left text-xs text-ink-muted uppercase tracking-wide">
                  <th className="pb-2 pr-4">Student</th>
                  <th className="pb-2 pr-4">Class</th>
                  <th className="pb-2 pr-4">Template</th>
                  <th className="pb-2 pr-4">Due</th>
                  <th className="pb-2 pr-4">Paid</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2 pr-4">Due date</th>
                  <th className="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {studentFees.map((r) => (
                  <tr key={r.id} className="border-b border-ink/5">
                    <td className="py-3 pr-4 font-medium">
                      {r.studentName}
                      <span className="block text-xs text-ink-muted">
                        Roll {r.rollNumber}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      {formatClassLabel({
                        grade: r.classGrade,
                        section: r.classSection,
                        stream: r.classStream,
                      })}
                    </td>
                    <td className="py-3 pr-4 text-ink-muted">
                      {fmtMoney(r.feeAmount)} / {r.feeFrequency}
                    </td>
                    <td className="py-3 pr-4">{fmtMoney(r.amountDue)}</td>
                    <td className="py-3 pr-4">{fmtMoney(r.amountPaid)}</td>
                    <td className="py-3 pr-4">
                      <span className={statusBadge(r.status)}>{r.status}</span>
                    </td>
                    <td className="py-3 pr-4">{r.dueDate.slice(0, 10)}</td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        className={`${btnGhost} mr-2`}
                        onClick={() => startEditFee(r)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className={btnDanger}
                        onClick={() => void onDeleteFee(r.id)}
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
