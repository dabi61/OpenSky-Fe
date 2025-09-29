import axios from "axios";
import type {
  VoucherPage,
  VoucherResponse,
  VoucherType,
} from "../types/response/voucher.type";
import axiosInstance from "../utils/AxisosInstance";
import type { VoucherEnum } from "../constants/VoucherEnum";
import type {
  VoucherCreateValidateType,
  VoucherUpdateValidateType,
} from "../types/schemas/voucher.schema";
import dayjs from "dayjs";

export const handleGetVoucherByType = async (
  type: VoucherEnum,
  page: number,
  limit: number
): Promise<VoucherPage> => {
  const res = await axios.get(
    `${
      import.meta.env.VITE_API_URL
    }vouchers/type/${type}?page=${page}&size=${limit}`
  );
  return res.data;
};

export const handleGetVoucherById = async (
  id: string
): Promise<VoucherType> => {
  const res = await axiosInstance.get(`vouchers/${id}`);
  return res.data;
};

export const handleGetAvailableVoucher = async (
  page: number,
  limit: number
): Promise<VoucherPage> => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}vouchers/active?page=${page}&size=${limit}`
  );
  return res.data;
};

export const handleGetUnsavedVoucher = async (
  page: number,
  limit: number
): Promise<VoucherPage> => {
  const res = await axiosInstance.get(
    `vouchers/active/not-saved?page=${page}&size=${limit}`
  );
  return res.data;
};

export const handleCreateVoucher = async (
  data: VoucherCreateValidateType
): Promise<VoucherResponse> => {
  try {
    const formData = new FormData();
    formData.append("percent", data.percent.toString());
    formData.append("tableType", data.tableType);
    formData.append(
      "startDate",
      dayjs(data.startDate).startOf("day").toISOString()
    );
    formData.append(
      "endDate",
      dayjs(data.endDate).startOf("day").toISOString()
    );
    if (data.description) formData.append("description", data.description);
    formData.append("code", data.code);
    const res = await axiosInstance.post("vouchers", formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    return {
      message: error?.response?.data?.message || "Tạo thất bại",
      voucherId: null,
    };
  }
};

export const handleUpdateVoucher = async (
  id: string,
  data: VoucherUpdateValidateType
): Promise<{ success: boolean; message: string }> => {
  try {
    const formData = new FormData();
    if (data.percent) formData.append("percent", data.percent.toString());
    if (data.tableType) formData.append("tableType", data.tableType);

    if (data.startDate)
      formData.append(
        "startDate",
        dayjs(data.startDate).startOf("day").toISOString()
      );

    if (data.endDate)
      formData.append(
        "endDate",
        dayjs(data.endDate).startOf("day").toISOString()
      );
    if (data.description) formData.append("description", data.description);
    if (data.code) formData.append("code", data.code);
    console.log(data);
    const res = await axiosInstance.put(`vouchers/${id}`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { success: true, message: res.data.message };
  } catch (error: any) {
    return {
      message: error?.response?.data?.message || "Tạo thất bại",
      success: false,
    };
  }
};

export const handleSoftDeleteVoucher = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await axiosInstance.put(`vouchers/${id}/delete`);
    return { success: true, message: res.data.message };
  } catch (error: any) {
    return {
      message: error?.response?.data?.message || "Tạo thất bại",
      success: false,
    };
  }
};
