import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type {
  HotelPage,
  HotelType,
  HotelTypeWithImgs,
} from "../types/response/hotel.type";
import {
  handleAllHotelExceptRemove,
  handleGetActiveHotel,
  handleGetCurrentHotel,
  handleGetHotelById,
  handleGetHotelByStatus,
  handleSearchHotel,
  handleSearchManageHotel,
} from "../api/hotel.api";
import { HotelStatus } from "../constants/HotelStatus";

type HotelContextType = {
  hotelList: HotelType[];
  hotelSearchList: HotelType[];
  loading: boolean;
  keyword: string;
  selectedHotel: HotelTypeWithImgs | null;
  setKeyword: Dispatch<SetStateAction<string>>;
  setSelectedHotel: (hotel: HotelTypeWithImgs | null) => void;
  getActiveHotel: (page: number, limit: number) => Promise<HotelPage>;
  getAllHotelExceptRemoved: (page: number, limit: number) => Promise<HotelPage>;
  getHotelById: (id: string) => Promise<HotelTypeWithImgs>;
  getMyHotel: () => Promise<HotelTypeWithImgs>;
  getHotelBySatus: (
    status: HotelStatus,
    page: number,
    limit: number
  ) => Promise<HotelPage>;
  searchManageHotel: (
    page: number,
    size: number,
    status?: HotelStatus
  ) => Promise<HotelPage>;
  searchHotel: (
    page: number,
    size: number,
    append: boolean
  ) => Promise<HotelPage>;
};

const HotelContext = createContext<HotelContextType | null>(null);

export const HotelProvider = ({ children }: { children: ReactNode }) => {
  const [hotelList, setHotelList] = useState<HotelType[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<HotelTypeWithImgs | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [hotelSearchList, setHotelSearchList] = useState<HotelType[]>([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    if (keyword === "") {
      setHotelSearchList([]);
    }
  }, [keyword]);

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

  const getMyHotel = async (): Promise<HotelTypeWithImgs> => {
    try {
      setLoading(true);
      const res = await handleGetCurrentHotel();
      setSelectedHotel(res);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const searchManageHotel = async (
    page: number,
    size: number,
    status?: HotelStatus
  ): Promise<HotelPage> => {
    const res = await handleSearchManageHotel(keyword, page, size, status);
    setHotelList(res.hotels);
    return res;
  };

  const searchHotel = async (
    page: number,
    size: number,
    append = false
  ): Promise<HotelPage> => {
    const res = await handleSearchHotel(keyword, page, size);
    setHotelSearchList((prev) =>
      append ? [...prev, ...res.hotels] : res.hotels
    );
    return res;
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
        hotelSearchList,
        setKeyword,
        selectedHotel,
        setSelectedHotel,
        getAllHotelExceptRemoved,
        loading,
        getActiveHotel,
        getHotelBySatus,
        getHotelById,
        getMyHotel,
        keyword,
        searchHotel,
        searchManageHotel,
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
