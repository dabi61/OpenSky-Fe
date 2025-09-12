import type { HotelStatus } from "../../constants/HotelStatus";
import type { ImageSummaryType } from "./image";
import type { UserSummaryType } from "./user";

export type HotelType = {
  id: string;
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

export type UserUpdateResponse = {
  message: string;
  hotel: HotelType;
};

export type HotelPage = {
  content: HotelType[];
  totalPages: number;
  pageNumber: number;
  pageSize: number;
};
