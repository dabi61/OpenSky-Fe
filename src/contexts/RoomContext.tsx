import { createContext, useContext, useState, type ReactNode } from "react";

import { handleGetRoomByHotel, handlegetRoomById } from "../api/hotelRoom.api";
import type {
  RoomPage,
  RoomType,
  RoomTypeWithImgs,
} from "../types/response/room.type";

type RoomContextType = {
  roomList: RoomType[];
  loading: boolean;
  selectedRoom: RoomTypeWithImgs | null;
  getRoomByHotel: (
    id: string,
    page: number,
    limit: number
  ) => Promise<RoomPage>;
  getRoomById: (id: string) => Promise<RoomTypeWithImgs>;
};

const RoomContext = createContext<RoomContextType | null>(null);

export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const [roomList, setRoomList] = useState<RoomType[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomTypeWithImgs | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const getRoomByHotel = async (
    id: string,
    page: number,
    limit: number
  ): Promise<RoomPage> => {
    try {
      setLoading(true);
      const res = await handleGetRoomByHotel(id, page, limit);
      setRoomList(res.rooms);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const getRoomById = async (id: string): Promise<RoomTypeWithImgs> => {
    try {
      setLoading(true);
      const res = await handlegetRoomById(id);
      setSelectedRoom(res);
      return res;
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoomContext.Provider
      value={{ roomList, selectedRoom, getRoomByHotel, getRoomById, loading }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoom must be used within a RoomProvider");
  }

  return context;
};
