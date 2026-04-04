import { TeachersManager } from "@/components/dashboard/teachers-manager";

export default function TeachersPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Teachers</h1>
      <p className="mt-2 max-w-2xl text-ink-muted">
        Staff directory and optional homeroom assignment. Email addresses must be unique across the
        whole system.
      </p>
      <div className="mt-8">
        <TeachersManager />
      </div>
    </div>
  );
}
