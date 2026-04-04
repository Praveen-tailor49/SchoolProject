import {
  date,
  foreignKey,
  index,
  integer,
  pgTable,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { studentFeeStatusEnum } from "./enums";
import { feeStructures } from "./fee-structures";
import { schools } from "./schools";
import { students } from "./students";

export const studentFees = pgTable(
  "student_fees",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    schoolId: uuid("school_id")
      .notNull()
      .references(() => schools.id),
    studentId: uuid("student_id").notNull(),
    feeStructureId: uuid("fee_structure_id").notNull(),
    amountDue: integer("amount_due").notNull(),
    amountPaid: integer("amount_paid").notNull().default(0),
    status: studentFeeStatusEnum("status").notNull(),
    dueDate: date("due_date").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    studentIdIdx: index("student_fees_student_id_idx").on(t.studentId),
    idSchoolUnique: unique("student_fees_id_school_id_unique").on(
      t.id,
      t.schoolId,
    ),
    studentSameSchoolFk: foreignKey({
      columns: [t.studentId, t.schoolId],
      foreignColumns: [students.id, students.schoolId],
    }),
    feeStructureSameSchoolFk: foreignKey({
      columns: [t.feeStructureId, t.schoolId],
      foreignColumns: [feeStructures.id, feeStructures.schoolId],
    }),
  }),
);
