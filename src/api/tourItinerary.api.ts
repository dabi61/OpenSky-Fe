import axios from "axios";
import type {
  TourItineraryResponse,
  TourItineraryType,
} from "../types/response/tour_itinerary.type";
import type {
  TourItineraryUpdateValidateType,
  TourItineraryValidateType,
} from "../types/schemas/tour_itinerary.schema";
import axiosInstance from "../utils/AxisosInstance";

export const handleCreateTourItinerary = async (
  data: TourItineraryValidateType
): Promise<TourItineraryResponse> => {
  try {
    const formData = new FormData();
    formData.append("tourID", data.tourID);
    if (data.description) formData.append("description", data.description);
    formData.append("location", data.location);
    formData.append("dayNumber", data.dayNumber.toString());
    console.log(data);
    const res = await axiosInstance.post(`tour_itinerary`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    return {
      message: error?.response?.data.message,
      itineraryId: null,
    };
  }
};

export const handleUpdateTourItinerary = async (
  id: string,
  data: TourItineraryUpdateValidateType
): Promise<{ success: boolean; message: string }> => {
  try {
    const formData = new FormData();
    if (data.description) formData.append("description", data.description);
    if (data.location) formData.append("location", data.location);
    if (data.dayNumber) formData.append("dayNumber", data.dayNumber.toString());

    const res = await axiosInstance.put(`tour_itinerary/${id}`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return {
      success: true,
      message: res.data.message ?? "Cập nhật thành công",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message ?? "Cập nhật thất bại",
    };
  }
};

export const handleDeleteTourItinerary = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await axiosInstance.put(`tour_itinerary/delete/${id}`);
    return {
      success: true,
      message: res.data.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message ?? "Cập nhật thất bại",
    };
  }
};

export const handleGetTourItineraryByTour = async (
  id: string
): Promise<TourItineraryType[]> => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}tour_itinerary/tour/${id}`
  );
  return res.data;
};
