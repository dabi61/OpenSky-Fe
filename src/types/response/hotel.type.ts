import type { HotelStatus } from "../../constants/HotelStatus";
import type { UserSummaryType } from "./user.type";

export type HotelType = {
  hotelID: string;
  email: string;
  user: UserSummaryType;
  address: string;
  province: string;
  lon: number;
  lat: number;
  hotelName: string;
  description: string;
  star: number;
  createdAt: Date;
  status: HotelStatus;
  firstImage: string;
};

export type HotelTypeWithImgs = {
  hotelID: string;
  email: string;
  user: UserSummaryType;
  address: string;
  province: string;
  lon: number;
  lat: number;
  hotelName: string;
  description: string;
  star: number;
  createdAt: Date;
  hotelStatus: HotelStatus;
  images: string[];
};

export type HotelResponse = {
  message: string;
  hotelID: string | null;
};

export type HotelPage = {
  hotels: HotelType[];
  totalPages: number;
  pageNumber: number;
  pageSize: number;
};
