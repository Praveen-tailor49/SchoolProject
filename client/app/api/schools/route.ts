import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { schools, users } from "@db/schema";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { setSessionCookie } from "@/lib/session-cookie";
import { signSessionToken } from "@/lib/token";

const bodySchema = z.object({
  name: z.string().min(2).max(200),
});

export async function POST(request: Request) {
  const me = await getCurrentUser();
  if (!me) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (me.schoolId) {
    return NextResponse.json(
      { error: "You already belong to a school." },
      { status: 409 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const name = parsed.data.name.trim();

  try {
    const schoolId = await db.transaction(async (tx) => {
      const [school] = await tx
        .insert(schools)
        .values({ name })
        .returning({ id: schools.id });
      if (!school) throw new Error("School insert failed");

      await tx
        .update(users)
        .set({ schoolId: school.id })
        .where(eq(users.id, me.id));

      return school.id;
    });

    const token = await signSessionToken({
      userId: me.id,
      email: me.email,
      schoolId,
    });
    await setSessionCookie(token);

    return NextResponse.json({ school: { id: schoolId, name } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not create school" }, { status: 500 });
  }
}
