import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { classStreamEnum } from "./enums";
import { schools } from "./schools";

export const classes = pgTable(
  "classes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    schoolId: uuid("school_id")
      .notNull()
      .references(() => schools.id),
    grade: integer("grade").notNull(),
    section: text("section").notNull(),
    stream: classStreamEnum("stream"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    schoolIdIdx: index("classes_school_id_idx").on(t.schoolId),
    schoolGradeSectionStreamUnique: uniqueIndex(
      "classes_school_grade_section_stream_unique",
    ).on(t.schoolId, t.grade, t.section, t.stream),
    idSchoolUnique: unique("classes_id_school_id_unique").on(
      t.id,
      t.schoolId,
    ),
  }),
);
