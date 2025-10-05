export type FeedbackType = {
  feedBackID: string;
  userID: string;
  userName: string;
  userAvatar: string;
  hotelID: string;
  hotelName: string;
  rate: number;
  description: string;
  createdAt: Date;
};

export type FeedbackResponse = {
  message: string;
  reviewId: string | null;
};

export type FeedbackPage = {
  reviews: FeedbackType[];
  totalPages: number;
  pageNumber: number;
  pageSize: number;
};

export type MyFeedbackType = {
  type: "Hotel" | "Tour";
  feedbackId: string;
  targetId: string;
  targetName: string;
  rate: number;
  description: string;
  createdAt: string;
};

export type MyFeedbackPage = {
  feedbacks: MyFeedbackType[];
  totalPages: number;
  pageNumber: number;
  pageSize: number;
};
