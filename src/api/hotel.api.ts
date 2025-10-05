import axios from "axios";
import { HotelStatus } from "../constants/HotelStatus";
import type {
  HotelPage,
  HotelResponse,
  HotelStatusResponse,
  HotelTypeWithImgs,
} from "../types/response/hotel.type";
import type {
  HotelCreateValidateType,
  HotelupdateValidateType,
} from "../types/schemas/hotel.schema";
import axiosInstance from "../utils/AxisosInstance";
import { handleGetUser } from "./user.api";

export const handleGetHotelByStatus = async (
  status: HotelStatus,
  page: number,
  limit: number
): Promise<HotelPage> => {
  const res = await axiosInstance.get(
    `hotels/status/${status}?page=${page}&size=${limit}`
  );
  return res.data;
};

export const handleGetCurrentHotel = async (): Promise<HotelTypeWithImgs> => {
  const res = await axiosInstance.get(`hotels/my-hotels`);
  return res.data[0];
};

export const handleGetActiveHotel = async (
  page: number,
  size: number
): Promise<HotelPage> => {
  const res = await axiosInstance.get(
    `${import.meta.env.VITE_API_URL}hotels/active?page=${page}&size=${size}`
  );
  return res.data;
};

export const handleAllHotelExceptRemove = async (
  page: number,
  size: number
): Promise<HotelPage> => {
  const res = await axiosInstance.get(
    `${import.meta.env.VITE_API_URL}hotels/all?page=${page}&limit=${size}`
  );
  return res.data;
};

export const handleUpdateHotelStatus = async (
  id: string,
  status: HotelStatus
): Promise<HotelStatusResponse> => {
  try {
    const res = await axiosInstance.put(
      `hotels/${id}/status`,
      { status },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error: any) {
    return {
      message: error?.response?.data.message,
      status: null,
    };
  }
};

export const handleGetHotelById = async (
  id: string
): Promise<HotelTypeWithImgs> => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}hotels/${id}`);
  return res.data;
};

export const handleCreateHotel = async (
  data: HotelCreateValidateType
): Promise<HotelResponse> => {
  try {
    const user = await handleGetUser();
    const formData = new FormData();
    formData.append("userId", user.userID);
    formData.append("email", data.email);
    formData.append("hotelName", data.hotelName);
    formData.append("address", data.address);
    formData.append("province", data.province);
    if (data.files && data.files.length > 0) {
      data.files.forEach((file) => {
        formData.append("files", file);
      });
    }
    if (data.description) {
      formData.append("description", data.description);
    }
    if (data.latitude && data.longitude) {
      formData.append("longitude", data.longitude.toString());
      formData.append("latitude", data.latitude.toString());
    }
    const res = await axiosInstance.post("hotels/apply", formData);
    return res.data;
  } catch (error: any) {
    return {
      message: error?.response?.data.message,
      hotelID: null,
    };
  }
};

export const handleUpdateHotel = async (
  hotelID: string,
  hotel: HotelupdateValidateType
): Promise<{ success: boolean; message: string }> => {
  try {
    const formData = new FormData();
    if (hotel.hotelName) formData.append("hotelName", hotel.hotelName);
    if (hotel.email) formData.append("email", hotel.email);
    if (hotel.address) {
      formData.append("address", hotel.address.toString());
    }
    if (hotel.latitude && hotel.longitude) {
      formData.append("longitude", hotel.longitude.toString());
      formData.append("latitude", hotel.latitude.toString());
    }
    if (hotel.deleteImageIds)
      formData.append("deleteImageIds", hotel.deleteImageIds.join(","));
    if (hotel.description) formData.append("description", hotel.description);
    if (hotel.files && hotel.files.length > 0) {
      hotel.files.forEach((file) => {
        formData.append("files", file);
      });
    }
    if (hotel.province) formData.append("province", hotel.province);
    const res = await axiosInstance.put(`hotels/${hotelID}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return {
      success: true,
      message: res.data.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Cập nhật thất bại!",
    };
  }
};
