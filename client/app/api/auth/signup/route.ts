import { hashSync } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { users } from "@db/schema";
import { db } from "@/lib/db";
import { setSessionCookie } from "@/lib/session-cookie";
import { signSessionToken } from "@/lib/token";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { email, password } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();

  const passwordHash = hashSync(password, 12);

  try {
    const [created] = await db
      .insert(users)
      .values({
        email: normalizedEmail,
        passwordHash,
        role: "admin",
        schoolId: null,
      })
      .returning({
        id: users.id,
        email: users.email,
        schoolId: users.schoolId,
      });

    if (!created) {
      return NextResponse.json({ error: "Could not create account" }, { status: 500 });
    }

    const token = await signSessionToken({
      userId: created.id,
      email: created.email,
      schoolId: created.schoolId,
    });
    await setSessionCookie(token);

    return NextResponse.json({
      user: {
        id: created.id,
        email: created.email,
        schoolId: created.schoolId,
      },
    });
  } catch (e: unknown) {
    const code =
      e && typeof e === "object" && "code" in e
        ? String((e as { code: string }).code)
        : "";
    if (code === "23505") {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }
    console.error(e);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
