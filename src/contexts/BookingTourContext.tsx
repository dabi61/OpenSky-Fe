import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { RoomType } from "../types/response/room.type";
import type { ScheduleType } from "../types/response/schedule.type";

type BookingTourType = {
  schedule: ScheduleType;
  numberOfGuests: number;
};

type BookingRoomContextType = {
  tourBill: BookingTourType | null;
};

const BookingRoomContext = createContext<BookingRoomContextType | null>(null);

export const BookingRoomProvider = ({ children }: { children: ReactNode }) => {
  const [tourBill, setTourBill] = useState<BookingTourType | null>(() => {
    try {
      const stored = sessionStorage.getItem("TourBill");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    sessionStorage.setItem("TourBill", JSON.stringify(tourBill));
  }, [tourBill]);

  const calculateTotalPrice = (
    roomList: RoomType[],
    numberOfNights: number
  ) => {
    return roomList.reduce((acc, room) => acc + room.price * numberOfNights, 0);
  };

  return (
    <BookingRoomContext.Provider
      value={{
        tourBill,
      }}
    >
      {children}
    </BookingRoomContext.Provider>
  );
};

export const useBookingRoom = () => {
  const context = useContext(BookingRoomContext);
  if (!context) {
    throw new Error("useBookingRoom must be used within a BookingRoomProvider");
  }
  return context;
};
