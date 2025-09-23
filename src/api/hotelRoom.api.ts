import axios from "axios";

import axiosInstance from "../utils/AxisosInstance";
import type {
  RoomPage,
  RoomResponse,
  RoomTypeWithImgs,
} from "../types/response/room.type";
import type { RoomCreateValidateType } from "../types/schemas/room.schema";
import type { RoomStatus } from "../constants/RoomStatus";

export const handleGetRoomByHotel = async (
  id: string,
  page: number,
  limit: number
): Promise<RoomPage> => {
  const res = await axiosInstance(
    `rooms/hotel/${id}?page=${page}&limit=${limit}`
  );
  return res.data;
};

export const handleGetRoomByStatus = async (
  id: string,
  status: RoomStatus,
  page: number,
  limit: number
): Promise<RoomPage> => {
  const res = await axiosInstance(
    `rooms/hotel/${id}?page=${page}&limit=${limit}`
  );
  return res.data;
};

export const handlegetRoomById = async (
  id: string
): Promise<RoomTypeWithImgs> => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}rooms/${id}`);
  return res.data;
};

export const handleCreateRoom = async (
  data: RoomCreateValidateType,
  hotelId: string
): Promise<RoomResponse> => {
  try {
    const formData = new FormData();
    formData.append("hotelID", hotelId);
    formData.append("roomName", data.roomName);
    formData.append("roomType", data.roomType);
    formData.append("address", data.address);
    formData.append("maxPeople", data.maxPeople.toString());
    formData.append("price", data.price.toString());
    if (data.files && data.files.length > 0) {
      data.files.forEach((file) => {
        formData.append("files", file);
      });
    }
    const res = await axiosInstance.post("rooms", formData);
    return res.data;
  } catch (error: any) {
    return {
      message: error?.response?.data.message,
      roomID: null,
    };
  }
};

export const handleUpdateRoomStatus = async (
  id: string,
  status: RoomStatus
): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await axiosInstance.put(`rooms/${id}/status`, { status });
    return { success: true, message: res.data.message };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message ?? "Có lỗi xảy ra",
    };
  }
};
