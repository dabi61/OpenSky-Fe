import type { ScheduleItineraryResponse } from "../types/response/scheduleItinerary.type";
import type {
  ScheduleItineraryCreateType,
  ScheduleItineraryType,
  ScheduleItineraryUpdateType,
} from "../types/schemas/scheduleItinerary.schema";
import axiosInstance from "../utils/AxisosInstance";

export const handleCreateScheduleItinerary = async (
  data: ScheduleItineraryCreateType
): Promise<ScheduleItineraryResponse> => {
  try {
    const res = await axiosInstance.post(`schedule_itinerary`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return {
      message: res.data.message,
      scheduleItineraryId: res.data.scheduleItId,
    };
  } catch (error: any) {
    return {
      message: error?.response?.data?.message ?? "Có lỗi xảy ra",
      scheduleItineraryId: null,
    };
  }
};

export const handleUpdateScheduleItinerary = async (
  data: ScheduleItineraryUpdateType
): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await axiosInstance.put(
      `schedule_itinerary/${data.scheduleItineraryID}`,
      { endTime: data.endTime.toISOString() }
    );
    return {
      success: true,
      message: res.data.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Hủy đơn thất bại!",
    };
  }
};

export const handleGetScheduleItineraryById = async (
  id: string
): Promise<ScheduleItineraryType> => {
  const res = await axiosInstance.get(`schedule_itinerary/${id}`);
  return {
    ...res.data,
    scheduleItineraryID: res.data.scheduleItID,
  };
};

export const handleGetScheduleItineraryBySchedule = async (
  id: string
): Promise<ScheduleItineraryType[]> => {
  const res = await axiosInstance.get(`schedule_itinerary/schedule/${id}`);
  return res.data.map((item: any) => ({
    ...item,
    scheduleItineraryID: item.scheduleItID,
  }));
};
