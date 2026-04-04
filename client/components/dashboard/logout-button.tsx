"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void logout()}
      disabled={loading}
      className="rounded-md border border-ink/12 px-3 py-1.5 text-xs font-medium text-ink-muted transition hover:border-ink/25 hover:text-ink disabled:opacity-50"
    >
      {loading ? "…" : "Sign out"}
    </button>
  );
}
