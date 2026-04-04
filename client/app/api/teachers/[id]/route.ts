import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { classes, teachers } from "@db/schema";
import { db } from "@/lib/db";
import { requireSchoolUser } from "@/lib/require-school";

const patchSchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  email: z.string().trim().email().optional(),
  assignedClassId: z.string().uuid().nullable().optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  const auth = await requireSchoolUser();
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const updates: Partial<typeof teachers.$inferInsert> = {};
  if (parsed.data.name !== undefined) updates.name = parsed.data.name;
  if (parsed.data.email !== undefined) {
    updates.email = parsed.data.email.toLowerCase();
  }
  if (parsed.data.assignedClassId !== undefined) {
    const cid = parsed.data.assignedClassId;
    if (cid) {
      const [cls] = await db
        .select({ id: classes.id })
        .from(classes)
        .where(and(eq(classes.id, cid), eq(classes.schoolId, auth.schoolId)))
        .limit(1);
      if (!cls) {
        return NextResponse.json(
          { error: "Homeroom class not found in your school." },
          { status: 400 },
        );
      }
    }
    updates.assignedClassId = cid;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  try {
    const [row] = await db
      .update(teachers)
      .set(updates)
      .where(
        and(eq(teachers.id, id), eq(teachers.schoolId, auth.schoolId)),
      )
      .returning();

    if (!row) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }
    return NextResponse.json({ teacher: row });
  } catch (e: unknown) {
    const code =
      e && typeof e === "object" && "code" in e
        ? String((e as { code: string }).code)
        : "";
    if (code === "23505") {
      return NextResponse.json(
        { error: "A teacher with this email already exists." },
        { status: 409 },
      );
    }
    console.error(e);
    return NextResponse.json({ error: "Could not update teacher" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const auth = await requireSchoolUser();
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;

  const [row] = await db
    .delete(teachers)
    .where(
      and(eq(teachers.id, id), eq(teachers.schoolId, auth.schoolId)),
    )
    .returning({ id: teachers.id });

  if (!row) {
    return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
