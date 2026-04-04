import { PGlite } from "@electric-sql/pglite";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  classes,
  feeStructures,
  schools,
  studentFees,
  students,
  teachers,
  users,
} from "../../client/db/schema";

const migrationsFolder = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "drizzle",
);

let pglite: PGlite;
let db: ReturnType<typeof drizzle>;

beforeAll(async () => {
  pglite = new PGlite();
  db = drizzle(pglite);
  await migrate(db, { migrationsFolder });
});

afterAll(async () => {
  await pglite.close();
});

async function insertSchool(name: string) {
  const [row] = await db
    .insert(schools)
    .values({ name })
    .returning({ id: schools.id });
  if (!row) throw new Error("insert school failed");
  return row.id;
}

describe("tenant-safe foreign keys", () => {
  it("rejects a student when class belongs to a different school", async () => {
    const schoolA = await insertSchool("School A");
    const schoolB = await insertSchool("School B");

    const [cls] = await db
      .insert(classes)
      .values({
        schoolId: schoolA,
        grade: 10,
        section: "A",
        stream: null,
      })
      .returning({ id: classes.id });

    await expect(
      db.insert(students).values({
        schoolId: schoolB,
        classId: cls!.id,
        name: "Cross-school",
        dob: "2010-01-15",
        rollNumber: 1,
      }),
    ).rejects.toThrow();
  });

  it("rejects a teacher homeroom class from another school", async () => {
    const schoolA = await insertSchool("School A");
    const schoolB = await insertSchool("School B");

    const [cls] = await db
      .insert(classes)
      .values({
        schoolId: schoolA,
        grade: 9,
        section: "B",
        stream: null,
      })
      .returning({ id: classes.id });

    await expect(
      db.insert(teachers).values({
        schoolId: schoolB,
        name: "Ms. Wrong",
        email: "wrong@example.com",
        assignedClassId: cls!.id,
      }),
    ).rejects.toThrow();
  });

  it("rejects student_fees when fee_structure is from another school", async () => {
    const schoolA = await insertSchool("School A");
    const schoolB = await insertSchool("School B");

    const [clsA] = await db
      .insert(classes)
      .values({
        schoolId: schoolA,
        grade: 8,
        section: "C",
        stream: null,
      })
      .returning({ id: classes.id });

    const [clsB] = await db
      .insert(classes)
      .values({
        schoolId: schoolB,
        grade: 8,
        section: "C",
        stream: null,
      })
      .returning({ id: classes.id });

    const [stu] = await db
      .insert(students)
      .values({
        schoolId: schoolA,
        classId: clsA!.id,
        name: "Fee Test",
        dob: "2011-06-01",
        rollNumber: 5,
      })
      .returning({ id: students.id });

    const [feeStructB] = await db
      .insert(feeStructures)
      .values({
        schoolId: schoolB,
        classId: clsB!.id,
        amount: 5000,
        frequency: "yearly",
      })
      .returning({ id: feeStructures.id });

    await expect(
      db.insert(studentFees).values({
        schoolId: schoolA,
        studentId: stu!.id,
        feeStructureId: feeStructB!.id,
        amountDue: 5000,
        amountPaid: 0,
        status: "pending",
        dueDate: "2026-04-01",
      }),
    ).rejects.toThrow();
  });
});

describe("uniqueness", () => {
  it("enforces UNIQUE(class_id, roll_number)", async () => {
    const schoolId = await insertSchool("Roll school");
    const [cls] = await db
      .insert(classes)
      .values({
        schoolId,
        grade: 7,
        section: "A",
        stream: null,
      })
      .returning({ id: classes.id });

    await db.insert(students).values({
      schoolId,
      classId: cls!.id,
      name: "First",
      dob: "2012-01-01",
      rollNumber: 10,
    });

    await expect(
      db.insert(students).values({
        schoolId,
        classId: cls!.id,
        name: "Duplicate roll",
        dob: "2012-02-02",
        rollNumber: 10,
      }),
    ).rejects.toThrow();
  });

  it("enforces UNIQUE(school_id, grade, section, stream) on classes", async () => {
    const schoolId = await insertSchool("Dup class school");
    await db.insert(classes).values({
      schoolId,
      grade: 6,
      section: "A",
      stream: "science",
    });

    await expect(
      db.insert(classes).values({
        schoolId,
        grade: 6,
        section: "A",
        stream: "science",
      }),
    ).rejects.toThrow();
  });

  it("enforces global unique user email", async () => {
    const s1 = await insertSchool("Email 1");
    const s2 = await insertSchool("Email 2");
    await db.insert(users).values({
      schoolId: s1,
      email: "same@school.edu",
      passwordHash: "x",
      role: "admin",
    });

    await expect(
      db.insert(users).values({
        schoolId: s2,
        email: "same@school.edu",
        passwordHash: "y",
        role: "staff",
      }),
    ).rejects.toThrow();
  });
});

/** Mirrors CRITICAL RULE 4 — persist via app layer or triggers; `status` is stored for reporting. */
function deriveStudentFeeStatus(
  amountDue: number,
  amountPaid: number,
): "pending" | "partial" | "paid" {
  if (amountPaid <= 0) return "pending";
  if (amountPaid < amountDue) return "partial";
  return "paid";
}

describe("fee status derivation (application rule)", () => {
  it("maps amounts to pending / partial / paid", () => {
    expect(deriveStudentFeeStatus(100, 0)).toBe("pending");
    expect(deriveStudentFeeStatus(100, 40)).toBe("partial");
    expect(deriveStudentFeeStatus(100, 100)).toBe("paid");
    expect(deriveStudentFeeStatus(100, 150)).toBe("paid");
  });
});

describe("happy path inserts", () => {
  it("allows aligned school graph for students, teachers, and fees", async () => {
    const schoolId = await insertSchool("Happy High");
    const [cls] = await db
      .insert(classes)
      .values({
        schoolId,
        grade: 12,
        section: "A",
        stream: "commerce",
      })
      .returning({ id: classes.id });

    const [stu] = await db
      .insert(students)
      .values({
        schoolId,
        classId: cls!.id,
        name: "Happy Student",
        dob: "2008-03-20",
        rollNumber: 1,
      })
      .returning({ id: students.id });

    await db.insert(teachers).values({
      schoolId,
      name: "Homeroom",
      email: "homeroom@happy.edu",
      assignedClassId: cls!.id,
    });

    const [fs] = await db
      .insert(feeStructures)
      .values({
        schoolId,
        classId: cls!.id,
        amount: 12000,
        frequency: "yearly",
      })
      .returning({ id: feeStructures.id });

    await db.insert(studentFees).values({
      schoolId,
      studentId: stu!.id,
      feeStructureId: fs!.id,
      amountDue: 12000,
      amountPaid: 6000,
      status: "partial",
      dueDate: "2026-05-01",
    });

    const rows = await db
      .select()
      .from(studentFees)
      .where(eq(studentFees.studentId, stu!.id));
    expect(rows).toHaveLength(1);
    expect(rows[0]?.amountPaid).toBe(6000);
  });
});
