import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { studentFees } from "@db/schema";
import { db } from "@/lib/db";
import { deriveFeeStatus } from "@/lib/fee-status";
import { requireSchoolUser } from "@/lib/require-school";

const patchSchema = z.object({
  amountDue: z.coerce.number().int().min(0).optional(),
  amountPaid: z.coerce.number().int().min(0).optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD").optional(),
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

  const [existing] = await db
    .select()
    .from(studentFees)
    .where(
      and(eq(studentFees.id, id), eq(studentFees.schoolId, auth.schoolId)),
    )
    .limit(1);

  if (!existing) {
    return NextResponse.json(
      { error: "Student fee record not found" },
      { status: 404 },
    );
  }

  const amountDue =
    parsed.data.amountDue !== undefined
      ? parsed.data.amountDue
      : existing.amountDue;
  const amountPaid =
    parsed.data.amountPaid !== undefined
      ? parsed.data.amountPaid
      : existing.amountPaid;

  const updates: Partial<typeof studentFees.$inferInsert> = {
    amountDue,
    amountPaid,
    status: deriveFeeStatus(amountDue, amountPaid),
  };
  if (parsed.data.dueDate !== undefined) {
    updates.dueDate = parsed.data.dueDate;
  }

  const [row] = await db
    .update(studentFees)
    .set(updates)
    .where(
      and(eq(studentFees.id, id), eq(studentFees.schoolId, auth.schoolId)),
    )
    .returning();

  return NextResponse.json({ studentFee: row });
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const auth = await requireSchoolUser();
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;

  const [row] = await db
    .delete(studentFees)
    .where(
      and(eq(studentFees.id, id), eq(studentFees.schoolId, auth.schoolId)),
    )
    .returning({ id: studentFees.id });

  if (!row) {
    return NextResponse.json(
      { error: "Student fee record not found" },
      { status: 404 },
    );
  }
  return NextResponse.json({ ok: true });
}
