import type { Dayjs } from "dayjs";
import type { BillStatus } from "../../constants/BillStatus";
import type { VoucherEnum } from "../../constants/VoucherEnum";
import type { billDetailType } from "./billDetail.type";
import type { UserSummaryType } from "./user.type";
import type { VoucherSummary } from "./voucher.type";

export type BillType = {
  billID: string;
  bookingID: string;
  deposit: number;
  refundPrice?: number;
  totalPrice: number;
  originalTotalPrice: number;
  discountAmount: 0.0;
  discountPercent: 0;
  status: BillStatus;
  startTime: Dayjs;
  endTime: Dayjs;
  createdAt: Date;
  userVoucherID: string;
  user: UserSummaryType;
  voucherInfo: VoucherSummary;
  billDetails: billDetailType;
};

export type BillResponse = {
  billID: string;
  originalTotalPrice: number;
  newTotalPrice: number;
  discountAmount: number;
  discountPercent: number;
  voucherInfo: {
    code: string;
    percent: number;
    tableType: VoucherEnum;
    description: string;
  };
  message: string;
};

export type BillPage = {
  bills: BillType[];
  totalPages: number;
  pageNumber: number;
  pageSize: number;
};

export type BillSummaryType = {
  billID: string;
  totalPrice: number;
  refundPrice: number;
  status: BillStatus;
  createdAt: Date;
};
