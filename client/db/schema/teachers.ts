import { foreignKey, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { classes } from "./classes";
import { schools } from "./schools";

export const teachers = pgTable(
  "teachers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    schoolId: uuid("school_id")
      .notNull()
      .references(() => schools.id),
    name: text("name").notNull(),
    email: text("email").notNull(),
    assignedClassId: uuid("assigned_class_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    emailUnique: uniqueIndex("teachers_email_unique").on(t.email),
    assignedClassSameSchoolFk: foreignKey({
      columns: [t.assignedClassId, t.schoolId],
      foreignColumns: [classes.id, classes.schoolId],
    }),
  }),
);
