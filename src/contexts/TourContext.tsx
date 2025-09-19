import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import {
  type TourPage,
  type TourType,
  type TourTypeWithImgs,
} from "../types/response/tour.type";
import { getTours, handleGetTourById } from "../api/tour.api";

type TourContextType = {
  tourList: TourType[];
  loading: boolean;
  getAllTours: (page: number, limit: number) => Promise<TourPage>;
  selectedTour: TourTypeWithImgs | null;
  setSelectedTour: (tour: TourTypeWithImgs | null) => void;
  getTourById: (id: string) => Promise<TourTypeWithImgs>;
};

const TourContext = createContext<TourContextType | null>(null);

export const TourProvider = ({ children }: { children: ReactNode }) => {
  const [tourList, setTourList] = useState<TourType[]>([]);
  const [selectedTour, setSelectedTour] = useState<TourTypeWithImgs | null>(
    null
  );
  const [loading, setLoading] = useState(false);

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
        setSelectedTour,
        getAllTours,
        getTourById,
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
