import { index, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { userRoleEnum } from "./enums";
import { schools } from "./schools";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Null until the user completes school onboarding (create school). */
    schoolId: uuid("school_id").references(() => schools.id),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum("role").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    schoolIdIdx: index("users_school_id_idx").on(t.schoolId),
    emailUnique: uniqueIndex("users_email_unique").on(t.email),
  }),
);
