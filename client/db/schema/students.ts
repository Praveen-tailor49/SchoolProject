import {
  date,
  foreignKey,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { classes } from "./classes";
import { schools } from "./schools";

export const students = pgTable(
  "students",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    schoolId: uuid("school_id")
      .notNull()
      .references(() => schools.id),
    classId: uuid("class_id").notNull(),
    name: text("name").notNull(),
    dob: date("dob").notNull(),
    rollNumber: integer("roll_number").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    schoolIdIdx: index("students_school_id_idx").on(t.schoolId),
    classRollUnique: uniqueIndex("students_class_roll_number_unique").on(
      t.classId,
      t.rollNumber,
    ),
    idSchoolUnique: unique("students_id_school_id_unique").on(
      t.id,
      t.schoolId,
    ),
    classSameSchoolFk: foreignKey({
      columns: [t.classId, t.schoolId],
      foreignColumns: [classes.id, classes.schoolId],
    }),
  }),
);
