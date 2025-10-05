import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import {
  handleGetFeedbackByHotel,
  handleGetFeedbackByTour,
  handleGetMyFeedback,
} from "../api/feedback.api";
import type {
  FeedbackPage,
  FeedbackType,
  MyFeedbackPage,
  MyFeedbackType,
} from "../types/response/feedback.type";

type FeedbackContextType = {
  feedbackList: FeedbackType[];
  myFeedbackList: MyFeedbackType[];
  loading: boolean;
  getFeedbackByTour: (
    id: string,
    page: number,
    size: number,
    append: boolean
  ) => Promise<FeedbackPage>;
  getFeedbackByHotel: (
    id: string,
    page: number,
    size: number,
    append: boolean
  ) => Promise<FeedbackPage>;
  getMyFeedback: (page: number, size: number) => Promise<MyFeedbackPage>;
  setFeedbackList: Dispatch<SetStateAction<FeedbackType[]>>;
};

const FeedbackContext = createContext<FeedbackContextType | null>(null);

export const FeedbackProvider = ({ children }: { children: ReactNode }) => {
  const [feedbackList, setFeedbackList] = useState<FeedbackType[]>([]);
  const [myFeedbackList, setMyFeedbackList] = useState<MyFeedbackType[]>([]);
  const [loading, setLoading] = useState(false);

  const getFeedbackByTour = async (
    id: string,
    page: number,
    size: number,
    append = false
  ): Promise<FeedbackPage> => {
    try {
      setLoading(true);
      const res = await handleGetFeedbackByTour(id, page, size);
      setFeedbackList((prev) =>
        append ? [...prev, ...res.reviews] : res.reviews
      );
      return res;
    } finally {
      setLoading(false);
    }
  };

  const getFeedbackByHotel = async (
    id: string,
    page: number,
    size: number,
    append = false
  ): Promise<FeedbackPage> => {
    try {
      setLoading(true);
      const res = await handleGetFeedbackByHotel(id, page, size);
      setFeedbackList((prev) =>
        append ? [...prev, ...res.reviews] : res.reviews
      );
      return res;
    } finally {
      setLoading(false);
    }
  };

  const getMyFeedback = async (
    page: number,
    size: number
  ): Promise<MyFeedbackPage> => {
    try {
      setLoading(true);
      const res = await handleGetMyFeedback(page, size);
      setMyFeedbackList(res.feedbacks);
      return res;
    } finally {
      setLoading(false);
    }
  };

  return (
    <FeedbackContext.Provider
      value={{
        feedbackList,
        myFeedbackList,
        getFeedbackByTour,
        getFeedbackByHotel,
        getMyFeedback,
        setFeedbackList,
        loading,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error("useFeedback must be used within a FeedbackProvider");
  }

  return context;
};
