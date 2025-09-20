export type RoomType = {
  roomID: string;
  roomName: string;
  roomType: string;
  price: number;
  maxPeople: number;
  firstImage: string;
};

export type RoomTypeWithImgs = {
  roomID: string;
  roomName: string;
  roomType: string;
  price: number;
  maxPeople: number;
};

export type RoomResponse = {
  message: string;
  hotelID: string | null;
};

export type RoomPage = {
  rooms: RoomType[];
  totalPages: number;
  pageNumber: number;
  pageSize: number;
};
