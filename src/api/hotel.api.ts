import axios from "axios";
import { HotelStatus } from "../constants/HotelStatus";
import type {
  HotelPage,
  HotelResponse,
  HotelStatusResponse,
  HotelTypeWithImgs,
} from "../types/response/hotel.type";
import type { HotelCreateValidateType } from "../types/schemas/hotel.schema";
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

export const handleGetActiveHotel = async (
  page: number,
  limit: number
): Promise<HotelPage> => {
  const res = await axiosInstance.get(
    `${import.meta.env.VITE_API_URL}hotels/active?page=${page}&size=${limit}`
  );
  return res.data;
};

export const handleAllHotelExceptRemove = async (
  page: number,
  limit: number
): Promise<HotelPage> => {
  const res = await axiosInstance.get(
    `${import.meta.env.VITE_API_URL}hotels/all?page=${page}&size=${limit}`
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
    console.log(res);
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
