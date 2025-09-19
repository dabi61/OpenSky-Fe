import type { TourStatus } from "../../constants/TourStatus";

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
  images: string[];
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
