import axios from "axios";
import type {
  SchedulePage,
  ScheduleResponse,
  ScheduleType,
} from "../types/response/schedule.type";
import type {
  CreateScheduleType,
  UpdateScheduleType,
} from "../types/schemas/schedule.schema";
import dayjs from "dayjs";
import axiosInstance from "../utils/AxisosInstance";
import type { ScheduleStatus } from "../constants/ScheduleStatus";

export const handleGetAllSchedule = async (
  page: number,
  size: number
): Promise<SchedulePage> => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}schedules?page=${page}&size=${size}`
  );
  return res.data;
};

export const handleGetMychedule = async (
  page: number,
  size: number
): Promise<SchedulePage> => {
  const res = await axiosInstance(
    `schedules/my-assignments?page=${page}&size=${size}`
  );
  return res.data;
};

export const handleGetScheduleByTour = async (
  tourId: string,
  page: number,
  size: number
): Promise<SchedulePage> => {
  const res = await axios.get(
    `${
      import.meta.env.VITE_API_URL
    }schedules/tour/${tourId}?page=${page}&size=${size}`
  );
  return res.data;
};

export const handleGetScheduleByStatus = async (
  status: ScheduleStatus,
  page: number,
  size: number
): Promise<SchedulePage> => {
  const res = await axios.get(
    `${
      import.meta.env.VITE_API_URL
    }schedules/status/${status}?page=${page}&size=${size}`
  );
  return res.data;
};

export const handleGetScheduleById = async (
  id: string
): Promise<ScheduleType> => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}schedules/${id}`);
  return res.data;
};

export const handleCreateSchedule = async (
  data: CreateScheduleType
): Promise<ScheduleResponse> => {
  try {
    const formData = new FormData();
    formData.append("tourID", data.tourID);
    formData.append("userID", data.userID);
    formData.append("startTime", dayjs(data.startTime).toISOString());
    formData.append("endTime", dayjs(data.endTime).toISOString());
    const res = await axiosInstance.post("schedules", formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    return {
      message: error?.response?.data?.message || "Tạo thất bại",
      scheduleId: null,
    };
  }
};

export const handleUpdateSchedule = async (
  id: string,
  data: UpdateScheduleType
): Promise<{ success: boolean; message: string }> => {
  try {
    const formData = new FormData();
    if (data.userID) formData.append("userID", data.userID);
    if (data.startTime)
      formData.append("startTime", dayjs(data.startTime).toISOString());
    if (data.endTime)
      formData.append("endTime", dayjs(data.endTime).toISOString());
    formData.append("numberPeople", data.numberPeople.toString());
    formData.append("status", data.status);
    const res = await axiosInstance.put(`schedules/${id}`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return {
      success: true,
      message: res.data.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Cập nhật thất bại!",
    };
  }
};

export const handleSoftDeleteSchedule = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await axiosInstance.put(`schedules/delete/${id}`);
    return {
      success: true,
      message: res.data.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Tạo thất bại",
    };
  }
};
