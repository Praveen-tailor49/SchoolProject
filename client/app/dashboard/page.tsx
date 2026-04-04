import Link from "next/link";

const modules = [
  {
    href: "/dashboard/teachers",
    title: "Teachers",
    description: "Homeroom assignments, profiles, and contact details.",
    tag: "Staff",
  },
  {
    href: "/dashboard/students",
    title: "Students",
    description: "Rosters by class, rolls, and demographics.",
    tag: "Learners",
  },
  {
    href: "/dashboard/classes",
    title: "Classes",
    description: "Grades, sections, and streams for your timetable.",
    tag: "Structure",
  },
  {
    href: "/dashboard/fees",
    title: "Fees",
    description: "Structures per class and balances per student.",
    tag: "Finance",
  },
] as const;

export default function DashboardHomePage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Overview</h1>
      <p className="mt-2 max-w-2xl text-ink-muted">
        Pick a module to manage. Each area is scoped to your school only — ready to wire to your API
        when you are.
      </p>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2">
        {modules.map((m) => (
          <li key={m.href}>
            <Link
              href={m.href}
              className="group block h-full rounded-xl border border-ink/10 bg-parchment p-6 shadow-sm transition hover:border-forest/30 hover:shadow-md"
            >
              <span className="text-xs font-semibold tracking-wide text-forest-bright uppercase">
                {m.tag}
              </span>
              <h2 className="mt-2 font-display text-2xl text-ink group-hover:text-forest">
                {m.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{m.description}</p>
              <span className="mt-4 inline-block text-sm font-medium text-forest underline-offset-4 group-hover:underline">
                Open →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
