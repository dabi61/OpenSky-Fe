import type { Dayjs } from "dayjs";
import type { VoucherEnum } from "../../constants/VoucherEnum";

export type VoucherType = {
  voucherID: string;
  code: string;
  percent: number;
  tableType: VoucherEnum;
  startDate: Dayjs;
  endDate: Dayjs;
  description: string;
  usedCount: number;
  isDeleted: boolean;
  isAvailable: boolean;
};

export type VoucherResponse = {
  message: string;
  voucherId: string | null;
};

export type VoucherPage = {
  vouchers: VoucherType[];
  totalPages: number;
  pageNumber: number;
  pageSize: number;
};
