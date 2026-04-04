const DEV_SECRET = "dev-only-school-auth-secret-min-32-characters";

export function getAuthSecretBytes(): Uint8Array {
  const raw = process.env.AUTH_SECRET;
  if (raw && raw.length >= 32) {
    return new TextEncoder().encode(raw);
  }
  if (process.env.NODE_ENV === "development") {
    return new TextEncoder().encode(DEV_SECRET);
  }
  throw new Error(
    "AUTH_SECRET must be set (at least 32 characters) in production.",
  );
}
