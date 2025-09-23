import type { RoomStatus } from "../../constants/RoomStatus";

export type RoomType = {
  roomID: string;
  hotelID: string;
  roomName: string;
  roomType: string;
  address: string;
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
  price: number;
  maxPeople: number;
  status: RoomStatus;
  createdAt: Date;
  images: string[];
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
