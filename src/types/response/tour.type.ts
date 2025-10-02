import type { TourStatus } from "../../constants/TourStatus";
import type { ImageType } from "./image.type";

export type TourType = {
  tourID: string;
  tourName: string;
  address: string;
  province: string;
  star: number;
  price: number;
  maxPeople: number;
  status: TourStatus;
  description?: string;
  firstImage: string;
};

export type TourTypeWithImgs = {
  tourID: string;
  tourName: string;
  address: string;
  province: string;
  star: number;
  price: number;
  maxPeople: number;
  status: TourStatus;
  description?: string;
  images: ImageType[];
};

export type TourResponse = {
  message: string;
  tourID: string | null;
};

export type TourPage = {
  tours: TourType[];
  totalPages: number;
  pageNumber: number;
  pageSize: number;
};

export type TourSummary = {
  tourID: string;
  tourName: string;
  description: string;
  maxPeople: number;
  price: number;
  star: number;
};
