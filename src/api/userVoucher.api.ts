import type { VoucherEnum } from "../constants/VoucherEnum";
import type {
  UserVoucherPage,
  UserVoucherResponse,
} from "../types/response/userVoucher.type";
import axiosInstance from "../utils/AxisosInstance";

export const handleSaveVouchers = async (
  id: string
): Promise<UserVoucherResponse> => {
  try {
    const res = await axiosInstance.post("user_vouchers", { voucherID: id });
    return res.data;
  } catch (error: any) {
    return {
      message: error?.response?.data.message,
      userVoucherId: null,
    };
  }
};

export const handleGetMyVouchers = async (
  page: number,
  size: number
): Promise<UserVoucherPage> => {
  const res = await axiosInstance.get(
    `user_vouchers/my-vouchers?page=${page}&size=${size}`
  );
  return res.data;
};

export const handleGetActiveVouchersType = async (
  type: VoucherEnum,
  page: number,
  size: number
): Promise<UserVoucherPage> => {
  const res = await axiosInstance.get(
    `user_vouchers/my-vouchers/active?type=${type}&page=${page}&size=${size}`
  );
  return res.data;
};
