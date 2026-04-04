import { FeesManager } from "@/components/dashboard/fees-manager";

export default function FeesPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Fees</h1>
      <p className="mt-2 max-w-2xl text-ink-muted">
        Set fee templates per class, then open per-student fee rows to track what is owed and paid.
      </p>
      <div className="mt-8">
        <FeesManager />
      </div>
    </div>
  );
}
