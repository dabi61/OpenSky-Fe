import dayjs from "dayjs";
import type {
  BillPage,
  BillResponse,
  BillType,
} from "../types/response/bill.type";
import type { BillApplyType } from "../types/schemas/bill.schema";
import axiosInstance from "../utils/AxisosInstance";
import type { QrResponse, QrType } from "../types/response/qr.type";
import type { BillStatus } from "../constants/BillStatus";

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

export const handleGetBillByStatus = async (
  status: BillStatus,
  page: number,
  limit: number
): Promise<BillPage> => {
  const res = await axiosInstance.get(
    `bills/status/${status}?page=${page}&size=${limit}`
  );
  return res.data;
};

export const handleSearchManageBill = async (
  keyword: string,
  page: number,
  size: number,
  status?: BillStatus
): Promise<BillPage> => {
  const res = await axiosInstance.get(`bills/admin/search`, {
    params: {
      keyword,
      page,
      limit: size,
      ...(status && { status }),
    },
  });
  return res.data;
};

export const handleGetBillById = async (id: string): Promise<BillType> => {
  const res = await axiosInstance.get(`bills/${id}`);

  return {
    ...res.data,
    startTime: dayjs(res.data.startTime),
    endTime: dayjs(res.data.endTime),
    billDetails: res.data.billDetails[0],
  };
};

export const handleGetCurrentUserBill = async (
  page: number,
  size: number
): Promise<BillPage> => {
  const res = await axiosInstance.get(`bills/my?page=${page}&size=${size}`);
  return {
    ...res.data,
    bills: res.data.bills.map((bill: any) => ({
      ...bill,
      billDetails: bill.billDetails?.[0],
    })),
  };
};

export const handleGetAllBill = async (
  page: number,
  size: number
): Promise<BillPage> => {
  const res = await axiosInstance.get(`bills/all?page=${page}&size=${size}`);

  return {
    ...res.data,
    bills: res.data.bills.map((bill: any) => ({
      ...bill,
      billDetails: bill.billDetails?.[0],
    })),
  };
};

export const handleCreateQR = async (
  id: string
): Promise<QrType | { message: string }> => {
  try {
    const res = await axiosInstance.post(`bills/qr/create`, { billId: id });
    return res.data;
  } catch (error: any) {
    return { message: error?.response?.data?.message ?? "Có lỗi xảy ra" };
  }
};

export const handleScanQR = async (
  qr: string
): Promise<QrResponse | { message: string }> => {
  try {
    const res = await axiosInstance.post(`bills/qr/scan`, { qrCode: qr });
    return res.data;
  } catch (error: any) {
    return { message: error?.response?.data?.message ?? "Có lỗi xảy ra" };
  }
};
