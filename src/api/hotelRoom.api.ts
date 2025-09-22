import axios from "axios";

import axiosInstance from "../utils/AxisosInstance";
import type { RoomPage, RoomTypeWithImgs } from "../types/response/room.type";

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

export const handlegetRoomById = async (
  id: string
): Promise<RoomTypeWithImgs> => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}rooms/${id}`);
  return res.data;
};
