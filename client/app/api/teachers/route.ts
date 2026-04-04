import { and, asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { classes, teachers } from "@db/schema";
import { db } from "@/lib/db";
import { requireSchoolUser } from "@/lib/require-school";

const postSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email(),
  assignedClassId: z.string().uuid().nullable().optional(),
});

export async function GET() {
  const auth = await requireSchoolUser();
  if (!auth.ok) return auth.response;

  const rows = await db
    .select({
      id: teachers.id,
      name: teachers.name,
      email: teachers.email,
      assignedClassId: teachers.assignedClassId,
      createdAt: teachers.createdAt,
      homeroomGrade: classes.grade,
      homeroomSection: classes.section,
      homeroomStream: classes.stream,
    })
    .from(teachers)
    .leftJoin(classes, eq(teachers.assignedClassId, classes.id))
    .where(eq(teachers.schoolId, auth.schoolId))
    .orderBy(asc(teachers.name));

  return NextResponse.json({ teachers: rows });
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

  const assignedClassId =
    parsed.data.assignedClassId === undefined
      ? null
      : parsed.data.assignedClassId;

  if (assignedClassId) {
    const [cls] = await db
      .select({ id: classes.id })
      .from(classes)
      .where(
        and(
          eq(classes.id, assignedClassId),
          eq(classes.schoolId, auth.schoolId),
        ),
      )
      .limit(1);
    if (!cls) {
      return NextResponse.json(
        { error: "Homeroom class not found in your school." },
        { status: 400 },
      );
    }
  }

  try {
    const [row] = await db
      .insert(teachers)
      .values({
        schoolId: auth.schoolId,
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        assignedClassId,
      })
      .returning();

    return NextResponse.json({ teacher: row }, { status: 201 });
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
    return NextResponse.json({ error: "Could not create teacher" }, { status: 500 });
  }
}
