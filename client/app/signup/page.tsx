import { SignupForm } from "@/components/auth/signup-form";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="text-sm font-medium text-forest underline-offset-4 hover:underline"
        >
          ← Back
        </Link>
        <h1 className="mt-8 text-4xl text-ink">Create your account</h1>
        <p className="mt-2 text-ink-muted">
          Next, you will name your school. One admin account per signup — add teachers from the
          dashboard.
        </p>
        <SignupForm />
      </div>
    </div>
  );
}
