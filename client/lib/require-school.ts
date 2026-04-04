import { NextResponse } from "next/server";
import { getCurrentUser } from "./session";

export async function requireSchoolUser(): Promise<
  | { ok: true; schoolId: string }
  | { ok: false; response: NextResponse }
> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  if (!user.schoolId) {
    return {
      ok: false,
      response: NextResponse.json({ error: "No school assigned" }, { status: 403 }),
    };
  }
  return { ok: true, schoolId: user.schoolId };
}
