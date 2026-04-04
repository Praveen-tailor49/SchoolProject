import { and, asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { classes } from "@db/schema";
import { db } from "@/lib/db";
import { requireSchoolUser } from "@/lib/require-school";

const postSchema = z.object({
  grade: z.coerce.number().int().min(1).max(12),
  section: z.string().trim().min(1).max(20),
  stream: z.enum(["science", "commerce", "arts"]).nullable().optional(),
});

export async function GET() {
  const auth = await requireSchoolUser();
  if (!auth.ok) return auth.response;

  const rows = await db
    .select()
    .from(classes)
    .where(eq(classes.schoolId, auth.schoolId))
    .orderBy(asc(classes.grade), asc(classes.section));

  return NextResponse.json({ classes: rows });
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

  const stream =
    parsed.data.stream === undefined ? null : parsed.data.stream;

  try {
    const [row] = await db
      .insert(classes)
      .values({
        schoolId: auth.schoolId,
        grade: parsed.data.grade,
        section: parsed.data.section,
        stream,
      })
      .returning();

    return NextResponse.json({ class: row }, { status: 201 });
  } catch (e: unknown) {
    const code =
      e && typeof e === "object" && "code" in e
        ? String((e as { code: string }).code)
        : "";
    if (code === "23505") {
      return NextResponse.json(
        { error: "A class with this grade, section, and stream already exists." },
        { status: 409 },
      );
    }
    console.error(e);
    return NextResponse.json({ error: "Could not create class" }, { status: 500 });
  }
}
