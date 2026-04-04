import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { schools, users } from "@db/schema";
import { db } from "./db";
import { COOKIE_NAME, verifySessionToken } from "./token";

export type CurrentUser = {
  id: string;
  email: string;
  schoolId: string | null;
  role: string;
  schoolName: string | null;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  const claims = await verifySessionToken(token);
  if (!claims?.sub) return null;

  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      schoolId: users.schoolId,
      role: users.role,
      schoolName: schools.name,
    })
    .from(users)
    .leftJoin(schools, eq(users.schoolId, schools.id))
    .where(eq(users.id, claims.sub))
    .limit(1);

  const row = rows[0];
  if (!row) return null;

  return {
    id: row.id,
    email: row.email,
    schoolId: row.schoolId,
    role: row.role,
    schoolName: row.schoolName,
  };
}
