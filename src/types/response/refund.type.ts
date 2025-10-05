import type { RefundStatus } from "../../constants/RefundStatus";
import type { BillSummaryType } from "./bill.type";
import type { UserSummaryType } from "./user.type";

export type RefundType = {
  refundID: string;
  billID: string;
  description: string;
  status: RefundStatus;
  createdAt: Date;
  refundPercentage: number;
  refundAmount: number;
  policyDescription: string;
  daysUntilDeparture: number;
  bill: BillSummaryType;
  user: UserSummaryType;
};

export type RefundResponse = {
  refundID: string | null;
  message: string;
};

export type RefundPage = {
  refunds: RefundType[];
  totalPages: number;
  pageNumber: number;
  pageSize: number;
};
