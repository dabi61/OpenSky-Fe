import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import type {
  SchedulePage,
  ScheduleType,
} from "../types/response/schedule.type";
import {
  handleGetAllSchedule,
  handleGetMychedule,
  handleGetScheduleById,
  handleGetScheduleByTour,
} from "../api/schedule.api";
import type { ScheduleStatus } from "../constants/ScheduleStatus";

type ScheduleContextType = {
  scheduleList: ScheduleType[];
  loading: boolean;
  selectedSchedule: ScheduleType | null;
  getAllSchedule: (page: number, size: number) => Promise<SchedulePage>;
  getScheduleByTour: (
    id: string,
    page: number,
    size: number
  ) => Promise<SchedulePage>;
  getScheduleByStatus: (
    status: ScheduleStatus,
    page: number,
    size: number
  ) => Promise<SchedulePage>;
  getScheduleById: (id: string) => Promise<ScheduleType>;
  setSelectedSchedule: Dispatch<SetStateAction<ScheduleType | null>>;
  getMychedule: (page: number, size: number) => Promise<SchedulePage>;
};

const ScheduleContext = createContext<ScheduleContextType | null>(null);

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
  const [scheduleList, setScheduleList] = useState<ScheduleType[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleType | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const getAllSchedule = async (
    page: number,
    size: number
  ): Promise<SchedulePage> => {
    try {
      setLoading(true);
      const res = await handleGetAllSchedule(page, size);
      setScheduleList(res.schedules);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const getMychedule = async (
    page: number,
    size: number
  ): Promise<SchedulePage> => {
    try {
      setLoading(true);
      const res = await handleGetMychedule(page, size);
      setScheduleList(res.schedules);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const getScheduleByTour = async (
    id: string,
    page: number,
    size: number
  ): Promise<SchedulePage> => {
    try {
      setLoading(true);
      const res = await handleGetScheduleByTour(id, page, size);
      setScheduleList(res.schedules);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const getScheduleByStatus = async (
    status: ScheduleStatus,
    page: number,
    size: number
  ): Promise<SchedulePage> => {
    try {
      setLoading(true);
      const res = await handleGetScheduleByTour(status, page, size);
      setScheduleList(res.schedules);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const getScheduleById = async (id: string): Promise<ScheduleType> => {
    try {
      setLoading(true);
      const res = await handleGetScheduleById(id);
      setSelectedSchedule(res);
      return res;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScheduleContext.Provider
      value={{
        scheduleList,
        selectedSchedule,
        getAllSchedule,
        getScheduleByTour,
        getScheduleById,
        setSelectedSchedule,
        getScheduleByStatus,
        getMychedule,
        loading,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }

  return context;
};
