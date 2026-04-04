import { CreateSchoolForm } from "@/components/onboarding/create-school-form";

export default function CreateSchoolPage() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <p className="text-sm font-medium tracking-[0.2em] text-forest-bright uppercase">
          Step 2 of 2
        </p>
        <h1 className="mt-4 text-4xl text-ink">Name your school</h1>
        <p className="mt-2 text-ink-muted">
          This creates your campus workspace. Everything you add stays inside this school.
        </p>
        <CreateSchoolForm />
      </div>
    </div>
  );
}
