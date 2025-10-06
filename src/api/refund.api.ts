import type { RefundStatus } from "../constants/RefundStatus";
import type {
  RefundPage,
  RefundResponse,
  RefundType,
} from "../types/response/refund.type";
import type { RefundCreateType } from "../types/schemas/refund.schema";
import axiosInstance from "../utils/AxisosInstance";

export const handleCreateRefund = async (
  refund: RefundCreateType
): Promise<RefundResponse> => {
  console.log(refund);
  try {
    const res = await axiosInstance.post(`refunds`, refund, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    return {
      message: error?.response?.data?.message || "Cập nhật thất bại",
      refundID: null,
    };
  }
};

export const handleGetRufunds = async (
  page: number,
  size: number
): Promise<RefundPage> => {
  const res = await axiosInstance.get(`refunds?page=${page}&size=${size}`);
  return res.data;
};

export const handleGetRefundById = async (id: string): Promise<RefundType> => {
  const res = await axiosInstance.get(`refunds/${id}`);
  return res.data;
};

export const handleGetRefundByBill = async (
  id: string
): Promise<RefundType | { message: string }> => {
  const res = await axiosInstance.get(`refunds/bill/${id}`, {
    validateStatus: () => true,
  });

  console.log(res.status);

  if (res.status === 404) {
    return { message: res.data?.message || "Không tìm thấy yêu cầu hoàn tiền" };
  }

  return res.data;
};

export const handleGetRefundByStatus = async (
  status: RefundStatus,
  page: number,
  size: number
): Promise<RefundPage> => {
  const res = await axiosInstance.get(
    `refunds/status/${status}?page=${page}&size=${size}`
  );
  return res.data;
};

export const handleApproveRefund = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await axiosInstance.put(`refunds/${id}/approve`);
    return {
      success: true,
      message: res.data.message ?? "Cập nhật thành công",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message ?? "Cập nhật thất bại",
    };
  }
};

export const handleRejectRefund = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await axiosInstance.put(`refunds/${id}/reject`);
    return {
      success: true,
      message: res.data.message ?? "Cập nhật thành công",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message ?? "Cập nhật thất bại",
    };
  }
};
