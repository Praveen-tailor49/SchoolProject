import { StudentsManager } from "@/components/dashboard/students-manager";

export default function StudentsPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Students</h1>
      <p className="mt-2 max-w-2xl text-ink-muted">
        Enrol learners into a class. Roll numbers are unique within each class.
      </p>
      <div className="mt-8">
        <StudentsManager />
      </div>
    </div>
  );
}
