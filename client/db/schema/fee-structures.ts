import {
  foreignKey,
  integer,
  pgTable,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { feeFrequencyEnum } from "./enums";
import { classes } from "./classes";
import { schools } from "./schools";

export const feeStructures = pgTable(
  "fee_structures",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    schoolId: uuid("school_id")
      .notNull()
      .references(() => schools.id),
    classId: uuid("class_id").notNull(),
    amount: integer("amount").notNull(),
    frequency: feeFrequencyEnum("frequency").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    idSchoolUnique: unique("fee_structures_id_school_id_unique").on(
      t.id,
      t.schoolId,
    ),
    classSameSchoolFk: foreignKey({
      columns: [t.classId, t.schoolId],
      foreignColumns: [classes.id, classes.schoolId],
    }),
  }),
);
