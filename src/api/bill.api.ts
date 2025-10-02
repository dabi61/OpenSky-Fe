import type { BillResponse } from "../types/response/bill.type";
import type { BillApplyType } from "../types/schemas/bill.schema";
import axiosInstance from "../utils/AxisosInstance";

export const handleApplyVoucherToBill = async (
  data: BillApplyType
): Promise<BillResponse | { message: string }> => {
  try {
    const fomrData = new FormData();
    fomrData.append("billID", data.billID);
    fomrData.append("userVoucherID", data.userVoucherID);
    const res = await axiosInstance.put("bills/apply-voucher", fomrData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    return {
      message: error?.response?.data?.message ?? "Có lỗi xảy ra",
    };
  }
};

export const handleGetBillById = async (id: string) => {};
