import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import {
  type TourPage,
  type TourType,
  type TourTypeWithImgs,
} from "../types/response/tour.type";
import {
  getTours,
  handleGetTourById,
  handleGetTourByProvince,
  handleGetTourByStar,
  handleSearchTour,
} from "../api/tour.api";
import type { TourItineraryType } from "../types/response/tour_itinerary.type";
import { handleGetTourItineraryByTour } from "../api/tourItinerary.api";

type TourContextType = {
  tourList: TourType[];
  loading: boolean;
  keyword: string;
  tourSearchList: TourType[];
  setKeyword: Dispatch<SetStateAction<string>>;
  getAllTours: (page: number, limit: number) => Promise<TourPage>;
  selectedTour: TourTypeWithImgs | null;
  getTourItineraryByTour: (id: string) => Promise<TourItineraryType[]>;
  setSelectedTour: (tour: TourTypeWithImgs | null) => void;
  getTourById: (id: string) => Promise<TourTypeWithImgs>;
  tourItineraryList: TourItineraryType[];
  searchTour: (
    page: number,
    size: number,
    append: boolean
  ) => Promise<TourPage>;
  getTourByProvince: (
    province: string,
    page: number,
    size: number
  ) => Promise<TourPage>;
  getTourByStar: (
    star: number,
    page: number,
    size: number
  ) => Promise<TourPage>;
};

const TourContext = createContext<TourContextType | null>(null);

export const TourProvider = ({ children }: { children: ReactNode }) => {
  const [tourList, setTourList] = useState<TourType[]>([]);
  const [selectedTour, setSelectedTour] = useState<TourTypeWithImgs | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [tourItineraryList, setTourItineraryList] = useState<
    TourItineraryType[]
  >([]);
  const [tourSearchList, setTourSearchList] = useState<TourType[]>([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    if (keyword === "") {
      setTourSearchList([]);
    }
  }, [keyword]);

  const searchTour = async (
    page: number,
    size: number,
    append = false
  ): Promise<TourPage> => {
    const res = await handleSearchTour(keyword, page, size);
    setTourSearchList((prev) => (append ? [...prev, ...res.tours] : res.tours));
    return res;
  };

  const getTourById = async (id: string): Promise<TourTypeWithImgs> => {
    try {
      setLoading(true);
      const res = await handleGetTourById(id);
      setSelectedTour(res);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const getTourItineraryByTour = async (
    id: string
  ): Promise<TourItineraryType[]> => {
    if (!id) return [];
    const res = await handleGetTourItineraryByTour(id);
    setTourItineraryList(res);
    return res;
  };

  const getTourByProvince = async (
    province: string,
    page: number,
    size: number
  ): Promise<TourPage> => {
    const res = await handleGetTourByProvince(province, page, size);
    setTourList(res.tours);
    return res;
  };

  const getTourByStar = async (
    star: number,
    page: number,
    size: number
  ): Promise<TourPage> => {
    const res = await handleGetTourByStar(star, page, size);
    setTourList(res.tours);
    return res;
  };

  const getAllTours = useCallback(
    async (page: number, limit: number): Promise<TourPage> => {
      try {
        setLoading(true);
        const res = await getTours(page, limit);
        setTourList(res.tours);
        return res;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return (
    <TourContext.Provider
      value={{
        tourList,
        loading,
        selectedTour,
        keyword,
        searchTour,
        setKeyword,
        tourSearchList,
        setSelectedTour,
        getAllTours,
        getTourById,
        getTourItineraryByTour,
        tourItineraryList,
        getTourByProvince,
        getTourByStar,
      }}
    >
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
};
