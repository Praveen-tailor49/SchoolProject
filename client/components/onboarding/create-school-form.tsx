"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreateSchoolForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/schools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Could not create school");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 space-y-6">
      {error ? (
        <p
          className="rounded-md border border-clay/40 bg-clay/10 px-3 py-2 text-sm text-ink"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      <div>
        <label htmlFor="school" className="block text-sm font-medium text-ink-muted">
          School name
        </label>
        <input
          id="school"
          name="school"
          type="text"
          required
          minLength={2}
          maxLength={200}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Riverside Academy"
          className="mt-2 w-full rounded-md border border-ink/12 bg-parchment px-3 py-2.5 text-ink outline-none ring-forest/30 transition placeholder:text-ink-muted/60 focus:border-forest/50 focus:ring-2"
        />
        <p className="mt-2 text-xs text-ink-muted">
          You will be the admin for this school. You can add teachers and staff later.
        </p>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-forest py-3 text-sm font-semibold tracking-wide text-parchment shadow-[0_2px_0_#0f2e22] transition hover:bg-forest-bright disabled:opacity-60"
      >
        {loading ? "Saving…" : "Continue to dashboard"}
      </button>
    </form>
  );
}
