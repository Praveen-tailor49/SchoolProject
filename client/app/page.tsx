import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative min-h-full overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%231b4332' stroke-opacity='0.12'%3E%3Cpath d='M0 40h80M40 0v80'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative mx-auto flex min-h-full max-w-5xl flex-col justify-center px-6 py-20 sm:px-10">
        <p className="text-sm font-medium tracking-[0.2em] text-forest-bright uppercase">
          Operations
        </p>
        <h1 className="mt-4 max-w-xl text-5xl leading-[1.05] text-ink sm:text-6xl">
          Run your school from one calm place.
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-muted">
          Teachers, students, fees, and classes — structured for a single campus,
          scoped so data never crosses schools.
        </p>
        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-md bg-forest px-8 py-3 text-sm font-semibold tracking-wide text-parchment shadow-[0_2px_0_#0f2e22] transition hover:bg-forest-bright"
          >
            Create account
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md border border-ink/15 bg-parchment px-8 py-3 text-sm font-semibold text-ink transition hover:border-forest/40 hover:text-forest"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
