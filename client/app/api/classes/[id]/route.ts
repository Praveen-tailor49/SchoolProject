import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { classes } from "@db/schema";
import { db } from "@/lib/db";
import { requireSchoolUser } from "@/lib/require-school";

const patchSchema = z.object({
  grade: z.coerce.number().int().min(1).max(12).optional(),
  section: z.string().trim().min(1).max(20).optional(),
  stream: z
    .union([z.enum(["science", "commerce", "arts"]), z.null()])
    .optional(),
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

  const updates: Partial<typeof classes.$inferInsert> = {};
  if (parsed.data.grade !== undefined) updates.grade = parsed.data.grade;
  if (parsed.data.section !== undefined) updates.section = parsed.data.section;
  if (parsed.data.stream !== undefined) updates.stream = parsed.data.stream;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  try {
    const [row] = await db
      .update(classes)
      .set(updates)
      .where(
        and(eq(classes.id, id), eq(classes.schoolId, auth.schoolId)),
      )
      .returning();

    if (!row) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }
    return NextResponse.json({ class: row });
  } catch (e: unknown) {
    const code =
      e && typeof e === "object" && "code" in e
        ? String((e as { code: string }).code)
        : "";
    if (code === "23505") {
      return NextResponse.json(
        { error: "Another class already uses this grade, section, and stream." },
        { status: 409 },
      );
    }
    console.error(e);
    return NextResponse.json({ error: "Could not update class" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const auth = await requireSchoolUser();
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;

  try {
    const [row] = await db
      .delete(classes)
      .where(
        and(eq(classes.id, id), eq(classes.schoolId, auth.schoolId)),
      )
      .returning({ id: classes.id });

    if (!row) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
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
            "This class is still linked to students, teachers, or fee rules. Remove those first.",
        },
        { status: 409 },
      );
    }
    console.error(e);
    return NextResponse.json({ error: "Could not delete class" }, { status: 500 });
  }
}
