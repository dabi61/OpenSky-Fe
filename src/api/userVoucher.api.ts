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

export const handleGetMyVouchers = async (): Promise<UserVoucherPage> => {
  const res = await axiosInstance.get("user_vouchers/my-vouchers");
  console.log("vouchers:", res);
  return res.data;
};
