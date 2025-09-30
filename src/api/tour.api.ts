import axios from "axios";
import type {
  TourPage,
  TourResponse,
  TourTypeWithImgs,
} from "../types/response/tour.type";
import type {
  TourCreateValidateType,
  TourUpdateValidateType,
} from "../types/schemas/tour.schema";
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

export const handleSoftDeleteTour = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await axiosInstance.put(`tours/delete/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { success: true, message: res.data.message };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message ?? "Có lỗi xảy ra",
    };
  }
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

export const handleUpdateTour = async (
  tourID: string,
  tour: TourUpdateValidateType
): Promise<{ success: boolean; message: string }> => {
  try {
    const formData = new FormData();
    if (tour.tourName) formData.append("tourName", tour.tourName);
    if (tour.price) formData.append("price", tour.price.toString());
    if (tour.maxPeople) formData.append("maxPeople", tour.maxPeople.toString());
    if (tour.address) formData.append("address", tour.address.toString());
    if (tour.description) formData.append("description", tour.description);
    if (tour.deleteImageIds)
      formData.append("deleteImageIds", tour.deleteImageIds.join(","));
    if (tour.files && tour.files.length > 0) {
      tour.files.forEach((file) => {
        formData.append("files", file);
      });
    }
    if (tour.province) formData.append("province", tour.province);
    const res = await axiosInstance.put(`tours/${tourID}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
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

export const handleGetTourById = async (
  id: string
): Promise<TourTypeWithImgs> => {
  const res = await axiosInstance.get(`tours/${id}`);
  return res.data;
};

export const handleGetTourByStar = async (
  star: number,
  page: number,
  size: number
): Promise<TourPage> => {
  const res = await axios.get(
    `${
      import.meta.env.VITE_API_URL
    }/tours/star/${star}?page=${page}&size=${size}`
  );
  return res.data;
};
