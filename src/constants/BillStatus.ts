export const BillStatus = {
  PENDING: "Pending",
  PAID: "Paid",
  CANCELLD: "Cancelled",
  REFUNDED: "Refunded",
} as const;
export type BillStatus = (typeof BillStatus)[keyof typeof BillStatus];
