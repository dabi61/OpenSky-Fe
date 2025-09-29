import type { RoomStatus } from "../../constants/RoomStatus";
import type { ImageType } from "./image.type";

export type RoomType = {
  roomID: string;
  hotelID: string;
  roomName: string;
  roomType: string;
  address: string;
  hotelName: string;
  price: number;
  maxPeople: number;
  status: RoomStatus;
  createdAt: Date;
  firstImage: string;
};

export type RoomTypeWithImgs = {
  roomID: string;
  hotelID: string;
  roomName: string;
  roomType: string;
  address: string;
  hotelName: string;
  price: number;
  maxPeople: number;
  status: RoomStatus;
  createdAt: Date;
  images: ImageType[];
};

export type RoomPage = {
  rooms: RoomType[];
  totalPages: number;
  pageNumber: number;
  pageSize: number;
};

export type RoomResponse = {
  message: string;
  roomID: string | null;
};
