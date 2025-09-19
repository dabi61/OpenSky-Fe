import axios from "axios";
import type {
  TourPage,
  TourResponse,
  TourTypeWithImgs,
} from "../types/response/tour.type";
import type { TourCreateValidateType } from "../types/schemas/tour.schema";
import axiosInstance from "../utils/AxisosInstance";

export const getTours = async (
  page: number,
  limit: number
): Promise<TourPage> => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}tours?page=${page}&size=${limit}`
  );
  return res.data;
};

export const handleCreateTour = async (
  tour: TourCreateValidateType
): Promise<TourResponse> => {
  try {
    const formData = new FormData();
    formData.append("tourName", tour.tourName);
    formData.append("price", tour.price.toString());
    formData.append("maxPeople", tour.maxPeople.toString());
    formData.append("address", tour.address);
    formData.append("province", tour.province);
    if (tour.files && tour.files.length > 0) {
      tour.files.forEach((file) => {
        formData.append("files", file);
      });
    }
    if (tour.description) {
      formData.append("description", tour.description);
    }
    const res = await axiosInstance.post("tours", formData);
    return res.data;
  } catch (error: any) {
    return {
      message: error?.response?.data.message,
      tourID: null,
    };
  }
};

export const handleGetTourById = async (
  id: string
): Promise<TourTypeWithImgs> => {
  const res = await axiosInstance.get(`tours/${id}`);
  return res.data;
};
