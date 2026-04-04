import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { getCurrentUser } from "@/lib/session";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.schoolId) redirect("/onboarding/school");

  return (
    <div className="min-h-full">
      <header className="border-b border-ink/10 bg-mist/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/dashboard" className="font-display text-xl text-ink">
              School Console
            </Link>
            <p className="mt-1 text-sm text-ink-muted">
              {user.schoolName ?? "Your school"}
              <span className="mx-2 text-ink/25">·</span>
              {user.email}
            </p>
          </div>
          <LogoutButton />
        </div>
        <div className="mx-auto max-w-6xl px-6 pb-4">
          <DashboardNav />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
