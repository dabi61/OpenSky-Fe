import type { Dayjs } from "dayjs";
import type { VoucherEnum } from "../../constants/VoucherEnum";

export type UserVoucherResponse = {
  message: string;
  userVoucherId: string | null;
};

export type UserVoucherType = {
  userVoucherID: string;
  userID: string;
  voucherID: string;
  isUsed: boolean;
  savedAt: Dayjs;
  userName: string;
  voucherCode: string;
  voucherPercent: number;
  voucherTableType: VoucherEnum;
  voucherStartDate: Dayjs;
  voucherEndDate: Dayjs;
  voucherDescription: string;
  voucherIsExpired: boolean;
};

export type UserVoucherPage = {
  userVouchers: UserVoucherType[];
  totalPages: number;
  pageNumber: number;
  pageSize: number;
};
