import { createContext, useContext, useState, type ReactNode } from "react";

import type { ScheduleItineraryType } from "../types/schemas/scheduleItinerary.schema";
import {
  handleGetScheduleItineraryById,
  handleGetScheduleItineraryBySchedule,
} from "../api/scheduleItinerary.api";

type ScheduleItineraryContextType = {
  scheduleItineraryList: ScheduleItineraryType[];
  loading: boolean;
  selectedScheduleItinerary: ScheduleItineraryType | null;
  getScheduleItineraryBySchedule: (
    id: string
  ) => Promise<ScheduleItineraryType[]>;
  getScheduleItineraryById: (id: string) => Promise<ScheduleItineraryType>;
};

const ScheduleItineraryContext =
  createContext<ScheduleItineraryContextType | null>(null);

export const ScheduleItineraryProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [scheduleItineraryList, setScheduleItineraryList] = useState<
    ScheduleItineraryType[]
  >([]);
  const [selectedScheduleItinerary, setSelectedSchedule] =
    useState<ScheduleItineraryType | null>(null);
  const [loading, setLoading] = useState(false);

  const getScheduleItineraryBySchedule = async (
    id: string
  ): Promise<ScheduleItineraryType[]> => {
    try {
      setLoading(true);
      const res = await handleGetScheduleItineraryBySchedule(id);
      setScheduleItineraryList(res);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const getScheduleItineraryById = async (
    id: string
  ): Promise<ScheduleItineraryType> => {
    try {
      setLoading(true);
      const res = await handleGetScheduleItineraryById(id);
      setSelectedSchedule(res);
      return res;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScheduleItineraryContext.Provider
      value={{
        scheduleItineraryList,
        selectedScheduleItinerary,
        getScheduleItineraryById,
        getScheduleItineraryBySchedule,
        loading,
      }}
    >
      {children}
    </ScheduleItineraryContext.Provider>
  );
};

export const useScheduleItinerary = () => {
  const context = useContext(ScheduleItineraryContext);
  if (!context) {
    throw new Error(
      "useScheduleItinerary must be used within a ScheduleItineraryProvider"
    );
  }

  return context;
};
