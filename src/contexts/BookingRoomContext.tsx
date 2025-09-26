import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { RoomType } from "../types/response/room.type";

type BookingRoomContext = {
  bookingRoomList: RoomType[];
  addToBookingList: (room: RoomType) => void;
  removeToBookingList: (roomID: string) => void;
};

const BookingRoomContext = createContext<BookingRoomContext | null>(null);

export const BookingRoomProvider = ({ children }: { children: ReactNode }) => {
  const [bookingRoomList, setBookingRoomList] = useState<RoomType[]>(() => {
    try {
      const stored = localStorage.getItem("bookingRoomList");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("bookingRoomList", JSON.stringify(bookingRoomList));
  }, [bookingRoomList]);

  const addToBookingList = (room: RoomType) => {
    setBookingRoomList((prev) =>
      prev.some((r) => r.roomID === room.roomID) ? prev : [...prev, room]
    );
  };

  const removeToBookingList = (roomID: string) => {
    setBookingRoomList((prev) => prev.filter((r) => r.roomID !== roomID));
  };

  return (
    <BookingRoomContext.Provider
      value={{
        bookingRoomList,
        addToBookingList,
        removeToBookingList,
      }}
    >
      {children}
    </BookingRoomContext.Provider>
  );
};

export const useBookingRoom = () => {
  const context = useContext(BookingRoomContext);
  if (!context) {
    throw new Error("useBookingRoom must be used within a BookingRProvider");
  }

  return context;
};
