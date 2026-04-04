import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="text-sm font-medium text-forest underline-offset-4 hover:underline"
        >
          ← Back
        </Link>
        <h1 className="mt-8 text-4xl text-ink">Welcome back</h1>
        <p className="mt-2 text-ink-muted">Sign in to open your school console.</p>
        <LoginForm />
      </div>
    </div>
  );
}
