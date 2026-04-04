import { and, asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  classes,
  feeStructures,
  studentFees,
  students,
} from "@db/schema";
import { db } from "@/lib/db";
import { deriveFeeStatus } from "@/lib/fee-status";
import { requireSchoolUser } from "@/lib/require-school";

const postSchema = z.object({
  studentId: z.string().uuid(),
  feeStructureId: z.string().uuid(),
  amountDue: z.coerce.number().int().min(0),
  amountPaid: z.coerce.number().int().min(0).optional().default(0),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
});

export async function GET() {
  const auth = await requireSchoolUser();
  if (!auth.ok) return auth.response;

  const rows = await db
    .select({
      id: studentFees.id,
      studentId: studentFees.studentId,
      feeStructureId: studentFees.feeStructureId,
      amountDue: studentFees.amountDue,
      amountPaid: studentFees.amountPaid,
      status: studentFees.status,
      dueDate: studentFees.dueDate,
      createdAt: studentFees.createdAt,
      studentName: students.name,
      rollNumber: students.rollNumber,
      classGrade: classes.grade,
      classSection: classes.section,
      classStream: classes.stream,
      feeAmount: feeStructures.amount,
      feeFrequency: feeStructures.frequency,
    })
    .from(studentFees)
    .innerJoin(students, eq(studentFees.studentId, students.id))
    .innerJoin(classes, eq(students.classId, classes.id))
    .innerJoin(
      feeStructures,
      eq(studentFees.feeStructureId, feeStructures.id),
    )
    .where(eq(studentFees.schoolId, auth.schoolId))
    .orderBy(asc(studentFees.dueDate), asc(students.name));

  return NextResponse.json({ studentFees: rows });
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

  const [stu] = await db
    .select({ id: students.id })
    .from(students)
    .where(
      and(
        eq(students.id, parsed.data.studentId),
        eq(students.schoolId, auth.schoolId),
      ),
    )
    .limit(1);

  if (!stu) {
    return NextResponse.json(
      { error: "Student not found in your school." },
      { status: 400 },
    );
  }

  const [fs] = await db
    .select({ id: feeStructures.id })
    .from(feeStructures)
    .where(
      and(
        eq(feeStructures.id, parsed.data.feeStructureId),
        eq(feeStructures.schoolId, auth.schoolId),
      ),
    )
    .limit(1);

  if (!fs) {
    return NextResponse.json(
      { error: "Fee structure not found in your school." },
      { status: 400 },
    );
  }

  const amountPaid = parsed.data.amountPaid ?? 0;
  const status = deriveFeeStatus(parsed.data.amountDue, amountPaid);

  try {
    const [row] = await db
      .insert(studentFees)
      .values({
        schoolId: auth.schoolId,
        studentId: parsed.data.studentId,
        feeStructureId: parsed.data.feeStructureId,
        amountDue: parsed.data.amountDue,
        amountPaid,
        status,
        dueDate: parsed.data.dueDate,
      })
      .returning();

    return NextResponse.json({ studentFee: row }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Could not create student fee record" },
      { status: 500 },
    );
  }
}
