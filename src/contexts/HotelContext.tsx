import { createContext, useContext, useState, type ReactNode } from "react";
import type {
  HotelPage,
  HotelType,
  HotelTypeWithImgs,
} from "../types/response/hotel.type";
import {
  handleAllHotelExceptRemove,
  handleGetActiveHotel,
  handleGetHotelById,
  handleGetHotelByStatus,
} from "../api/hotel.api";
import { HotelStatus } from "../constants/HotelStatus";

type HotelContextType = {
  hotelList: HotelType[];
  loading: boolean;
  selectedHotel: HotelTypeWithImgs | null;
  setSelectedHotel: (hotel: HotelTypeWithImgs | null) => void;
  getActiveHotel: (page: number, limit: number) => Promise<HotelPage>;
  getAllHotelExceptRemoved: (page: number, limit: number) => Promise<HotelPage>;
  getHotelById: (id: string) => Promise<HotelTypeWithImgs>;
  getHotelBySatus: (
    status: HotelStatus,
    page: number,
    limit: number
  ) => Promise<HotelPage>;
};

const HotelContext = createContext<HotelContextType | null>(null);

export const HotelProvider = ({ children }: { children: ReactNode }) => {
  const [hotelList, setHotelList] = useState<HotelType[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<HotelTypeWithImgs | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const getAllHotelExceptRemoved = async (
    page: number,
    limit: number
  ): Promise<HotelPage> => {
    try {
      setLoading(true);
      const res = await handleAllHotelExceptRemove(page, limit);
      setHotelList(res.hotels);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const getActiveHotel = async (
    page: number,
    limit: number
  ): Promise<HotelPage> => {
    try {
      setLoading(true);
      const res = await handleGetActiveHotel(page, limit);
      setHotelList(res.hotels);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const getHotelBySatus = async (
    status: HotelStatus,
    page: number,
    limit: number
  ): Promise<HotelPage> => {
    try {
      setLoading(true);
      const res = await handleGetHotelByStatus(status, page, limit);
      setHotelList(res.hotels);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const getHotelById = async (id: string): Promise<HotelTypeWithImgs> => {
    try {
      setLoading(true);
      const res = await handleGetHotelById(id);
      setSelectedHotel(res);
      return res;
    } finally {
      setLoading(false);
    }
  };

  return (
    <HotelContext.Provider
      value={{
        hotelList,
        selectedHotel,
        setSelectedHotel,
        getAllHotelExceptRemoved,
        loading,
        getActiveHotel,
        getHotelBySatus,
        getHotelById,
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error("useHotel must be used within HotelProvider");
  }
  return context;
};
