import { and, asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { classes, feeStructures } from "@db/schema";
import { db } from "@/lib/db";
import { requireSchoolUser } from "@/lib/require-school";

const postSchema = z.object({
  classId: z.string().uuid(),
  amount: z.coerce.number().int().min(0),
  frequency: z.enum(["monthly", "quarterly", "yearly"]),
});

export async function GET() {
  const auth = await requireSchoolUser();
  if (!auth.ok) return auth.response;

  const rows = await db
    .select({
      id: feeStructures.id,
      classId: feeStructures.classId,
      amount: feeStructures.amount,
      frequency: feeStructures.frequency,
      createdAt: feeStructures.createdAt,
      grade: classes.grade,
      section: classes.section,
      stream: classes.stream,
    })
    .from(feeStructures)
    .innerJoin(classes, eq(feeStructures.classId, classes.id))
    .where(eq(feeStructures.schoolId, auth.schoolId))
    .orderBy(asc(classes.grade), asc(classes.section));

  return NextResponse.json({ feeStructures: rows });
}

export async function POST(request: Request) {
  const auth = await requireSchoolUser();
  if (!auth.ok) return auth.response;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = postSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

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

  try {
    const [row] = await db
      .insert(feeStructures)
      .values({
        schoolId: auth.schoolId,
        classId: parsed.data.classId,
        amount: parsed.data.amount,
        frequency: parsed.data.frequency,
      })
      .returning();

    return NextResponse.json({ feeStructure: row }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Could not create fee structure" },
      { status: 500 },
    );
  }
}
