import { ClassesManager } from "@/components/dashboard/classes-manager";

export default function ClassesPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Classes</h1>
      <p className="mt-2 max-w-2xl text-ink-muted">
        Define grades, sections, and optional streams. Names must be unique per school.
      </p>
      <div className="mt-8">
        <ClassesManager />
      </div>
    </div>
  );
}
