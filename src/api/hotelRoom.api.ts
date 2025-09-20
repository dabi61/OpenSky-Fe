import axios from "axios";
import type {
  RoomPage,
  RoomTypeWithImgs,
} from "../types/response/hotel_room.type";
import axiosInstance from "../utils/AxisosInstance";

export const handleGetRoomByHotel = async (
  id: string,
  page: number,
  limit: number
): Promise<RoomPage> => {
  const res = await axiosInstance(
    `rooms/hotel/${id}?page=${page}&limit=${limit}`
  );
  console.log(res.data);
  return res.data;
};

export const handlegetRoomById = async (
  id: string
): Promise<RoomTypeWithImgs> => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}rooms/${id}`);
  return res.data;
};
