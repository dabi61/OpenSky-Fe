export const RefundStatus = {
  PENDING: "Pending",
  REJECTED: "Rejected",
  COMPLETED: "Completed",
} as const;

export type RefundStatus = (typeof RefundStatus)[keyof typeof RefundStatus];
