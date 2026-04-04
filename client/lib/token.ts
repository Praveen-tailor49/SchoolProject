import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { getAuthSecretBytes } from "./auth-secret";

const COOKIE_NAME = "school_session";

export { COOKIE_NAME };

export type SessionPayload = JWTPayload & {
  email: string;
  schoolId: string | null;
};

export async function signSessionToken(input: {
  userId: string;
  email: string;
  schoolId: string | null;
}): Promise<string> {
  return new SignJWT({
    email: input.email,
    schoolId: input.schoolId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(input.userId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getAuthSecretBytes());
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getAuthSecretBytes());
    const email = typeof payload.email === "string" ? payload.email : "";
    const schoolId =
      payload.schoolId === null || payload.schoolId === undefined
        ? null
        : String(payload.schoolId);
    return { ...payload, email, schoolId } as SessionPayload;
  } catch {
    return null;
  }
}
