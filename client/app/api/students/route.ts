import { and, asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { classes, students } from "@db/schema";
import { db } from "@/lib/db";
import { requireSchoolUser } from "@/lib/require-school";

const postSchema = z.object({
  name: z.string().trim().min(1).max(200),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  rollNumber: z.coerce.number().int().min(1),
  classId: z.string().uuid(),
});

export async function GET() {
  const auth = await requireSchoolUser();
  if (!auth.ok) return auth.response;

  const rows = await db
    .select({
      id: students.id,
      name: students.name,
      dob: students.dob,
      rollNumber: students.rollNumber,
      classId: students.classId,
      createdAt: students.createdAt,
      grade: classes.grade,
      section: classes.section,
      stream: classes.stream,
    })
    .from(students)
    .innerJoin(classes, eq(students.classId, classes.id))
    .where(eq(students.schoolId, auth.schoolId))
    .orderBy(
      asc(classes.grade),
      asc(classes.section),
      asc(students.rollNumber),
    );

  return NextResponse.json({ students: rows });
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
      .insert(students)
      .values({
        schoolId: auth.schoolId,
        classId: parsed.data.classId,
        name: parsed.data.name,
        dob: parsed.data.dob,
        rollNumber: parsed.data.rollNumber,
      })
      .returning();

    return NextResponse.json({ student: row }, { status: 201 });
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
    return NextResponse.json({ error: "Could not create student" }, { status: 500 });
  }
}
