import type { HotelStatus } from "../../constants/HotelStatus";
import type { ImageSummaryType } from "./image";
import type { UserSummaryType } from "./user";

export type HotelType = {
  hotelID: string;
  email: string;
  user: UserSummaryType;
  address: string;
  province: string;
  lon: number;
  lat: number;
  name: string;
  description: string;
  star: number;
  createdAt: Date;
  hotelStatus: HotelStatus;
  images: ImageSummaryType[];
};

export type HotelResponse = {
  message: string;
  hotelID: string | null;
};

export type HotelPage = {
  content: HotelType[];
  totalPages: number;
  pageNumber: number;
  pageSize: number;
};
