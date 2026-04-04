import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { classes, feeStructures } from "@db/schema";
import { db } from "@/lib/db";
import { requireSchoolUser } from "@/lib/require-school";

const patchSchema = z.object({
  classId: z.string().uuid().optional(),
  amount: z.coerce.number().int().min(0).optional(),
  frequency: z.enum(["monthly", "quarterly", "yearly"]).optional(),
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

  const updates: Partial<typeof feeStructures.$inferInsert> = {};
  if (parsed.data.amount !== undefined) updates.amount = parsed.data.amount;
  if (parsed.data.frequency !== undefined) {
    updates.frequency = parsed.data.frequency;
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
      .update(feeStructures)
      .set(updates)
      .where(
        and(
          eq(feeStructures.id, id),
          eq(feeStructures.schoolId, auth.schoolId),
        ),
      )
      .returning();

    if (!row) {
      return NextResponse.json(
        { error: "Fee structure not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ feeStructure: row });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Could not update fee structure" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const auth = await requireSchoolUser();
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;

  try {
    const [row] = await db
      .delete(feeStructures)
      .where(
        and(
          eq(feeStructures.id, id),
          eq(feeStructures.schoolId, auth.schoolId),
        ),
      )
      .returning({ id: feeStructures.id });

    if (!row) {
      return NextResponse.json(
        { error: "Fee structure not found" },
        { status: 404 },
      );
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
            "This fee structure is still linked to student fee rows. Remove those first.",
        },
        { status: 409 },
      );
    }
    console.error(e);
    return NextResponse.json(
      { error: "Could not delete fee structure" },
      { status: 500 },
    );
  }
}
