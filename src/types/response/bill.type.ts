import type { BillStatus } from "../../constants/BillStatus";
import type { VoucherEnum } from "../../constants/VoucherEnum";
import type { billDetailType } from "./billDetail.type";

export type BillType = {
  billID: string;
  userID: string;
  userName: string;
  bookingID: string;
  deposit: number;
  refundPrice?: number;
  totalPrice: number;
  originalTotalPrice: number;
  discountAmount: 0.0;
  discountPercent: 0;
  status: BillStatus;
  createdAt: Date;
  userVoucherID: null;
  voucherInfo: null;
  billDetails: billDetailType[];
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
