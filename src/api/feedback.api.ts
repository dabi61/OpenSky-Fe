import axios from "axios";
import type {
  FeedbackPage,
  FeedbackResponse,
  MyFeedbackPage,
} from "../types/response/feedback.type";
import type { FeedbackCreateType } from "../types/schemas/feedback.schema";
import axiosInstance from "../utils/AxisosInstance";

export const handleCreateFeedback = async (
  refund: FeedbackCreateType
): Promise<FeedbackResponse> => {
  try {
    const res = await axiosInstance.post(`feedback`, refund);
    return res.data;
  } catch (error: any) {
    return {
      message: error?.response?.data?.message || "Cập nhật thất bại",
      reviewId: null,
    };
  }
};

export const handleGetFeedbackByTour = async (
  id: string,
  page: number,
  size: number
): Promise<FeedbackPage> => {
  const res = await axios.get(
    `${
      import.meta.env.VITE_API_URL
    }feedback/tour/${id}?page=${page}&size=${size}`
  );
  return res.data;
};

export const handleGetFeedbackByHotel = async (
  id: string,
  page: number,
  size: number
): Promise<FeedbackPage> => {
  const res = await axios.get(
    `${
      import.meta.env.VITE_API_URL
    }feedback/hotel/${id}?page=${page}&limit=${size}`
  );
  return res.data;
};

export const handleGetMyFeedback = async (
  page: number,
  size: number
): Promise<MyFeedbackPage> => {
  const res = await axiosInstance.get(
    `feedback/my-feedbacks?page=${page}&size=${size}`
  );
  return res.data;
};
