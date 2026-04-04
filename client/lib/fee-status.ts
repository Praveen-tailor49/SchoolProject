export type FeeStatus = "pending" | "partial" | "paid";

export function deriveFeeStatus(amountDue: number, amountPaid: number): FeeStatus {
  if (amountPaid <= 0) return "pending";
  if (amountPaid < amountDue) return "partial";
  return "paid";
}
