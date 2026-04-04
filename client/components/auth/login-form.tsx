"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { error?: string; user?: { schoolId: string | null } };
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Could not sign in");
        return;
      }
      router.push(data.user?.schoolId ? "/dashboard" : "/onboarding/school");
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
        <label htmlFor="email" className="block text-sm font-medium text-ink-muted">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-md border border-ink/12 bg-parchment px-3 py-2.5 text-ink outline-none ring-forest/30 transition focus:border-forest/50 focus:ring-2"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-ink-muted">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-md border border-ink/12 bg-parchment px-3 py-2.5 text-ink outline-none ring-forest/30 transition focus:border-forest/50 focus:ring-2"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-forest py-3 text-sm font-semibold tracking-wide text-parchment shadow-[0_2px_0_#0f2e22] transition hover:bg-forest-bright disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-center text-sm text-ink-muted">
        No account?{" "}
        <Link href="/signup" className="font-medium text-forest underline-offset-4 hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
