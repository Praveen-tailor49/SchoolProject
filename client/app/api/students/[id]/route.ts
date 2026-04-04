import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { classes, students } from "@db/schema";
import { db } from "@/lib/db";
import { requireSchoolUser } from "@/lib/require-school";

const patchSchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD").optional(),
  rollNumber: z.coerce.number().int().min(1).optional(),
  classId: z.string().uuid().optional(),
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

  const updates: Partial<typeof students.$inferInsert> = {};
  if (parsed.data.name !== undefined) updates.name = parsed.data.name;
  if (parsed.data.dob !== undefined) updates.dob = parsed.data.dob;
  if (parsed.data.rollNumber !== undefined) {
    updates.rollNumber = parsed.data.rollNumber;
  }
  if (parsed.data.classId !== undefined) {
    const [cls] = await db
      .select({ id: classes.id })
      .from(classes)
      .where(
        and(
          eq(classes.id, parsed.data.classId),
          eq(classes.schoolId, auth.schoolId),
        ),
      )
      .limit(1);
    if (!cls) {
      return NextResponse.json(
        { error: "Class not found in your school." },
        { status: 400 },
      );
    }
    updates.classId = parsed.data.classId;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  try {
    const [row] = await db
      .update(students)
      .set(updates)
      .where(
        and(eq(students.id, id), eq(students.schoolId, auth.schoolId)),
      )
      .returning();

    if (!row) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    return NextResponse.json({ student: row });
  } catch (e: unknown) {
    const code =
      e && typeof e === "object" && "code" in e
        ? String((e as { code: string }).code)
        : "";
    if (code === "23505") {
      return NextResponse.json(
        { error: "This roll number is already used in that class." },
        { status: 409 },
      );
    }
    console.error(e);
    return NextResponse.json({ error: "Could not update student" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const auth = await requireSchoolUser();
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;

  try {
    const [row] = await db
      .delete(students)
      .where(
        and(eq(students.id, id), eq(students.schoolId, auth.schoolId)),
      )
      .returning({ id: students.id });

    if (!row) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const code =
      e && typeof e === "object" && "code" in e
        ? String((e as { code: string }).code)
        : "";
    if (code === "23503") {
      return NextResponse.json(
        {
          error:
            "This student still has fee records. Remove or reassign those first.",
        },
        { status: 409 },
      );
    }
    console.error(e);
    return NextResponse.json({ error: "Could not delete student" }, { status: 500 });
  }
}
