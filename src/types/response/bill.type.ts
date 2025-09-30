import type { VoucherEnum } from "../../constants/VoucherEnum";

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
