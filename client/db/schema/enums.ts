import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["admin", "teacher", "staff"]);

export const classStreamEnum = pgEnum("class_stream", [
  "science",
  "commerce",
  "arts",
]);

export const feeFrequencyEnum = pgEnum("fee_frequency", [
  "monthly",
  "quarterly",
  "yearly",
]);

export const studentFeeStatusEnum = pgEnum("student_fee_status", [
  "pending",
  "partial",
  "paid",
]);
