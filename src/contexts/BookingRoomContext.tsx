import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { RoomType } from "../types/response/room.type";
import type { TourType } from "../types/response/tour.type";
import { toast } from "sonner";

type BookingRoomContextType = {
  bookingRoomList: RoomType[];
  bookingTourList: TourType[];
  addHotelToBookingList: (room: RoomType) => void;
  addTourToBookingList: (tour: TourType) => void;
  removeToBookingList: (roomID: string) => void;
  removeAllBookingList: () => void;
};

const BookingRoomContext = createContext<BookingRoomContextType | null>(null);

export const BookingRoomProvider = ({ children }: { children: ReactNode }) => {
  const [bookingRoomList, setBookingRoomList] = useState<RoomType[]>(() => {
    try {
      const stored = localStorage.getItem("bookingRoomList");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [bookingTourList, setBookingTourList] = useState<TourType[]>(() => {
    try {
      const stored = localStorage.getItem("bookingTourList");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("bookingRoomList", JSON.stringify(bookingRoomList));
  }, [bookingRoomList]);

  useEffect(() => {
    localStorage.setItem("bookingTourList", JSON.stringify(bookingTourList));
  }, [bookingTourList]);

  const addHotelToBookingList = (room: RoomType) => {
    if (bookingTourList.length > 0) {
      setBookingTourList([]);
      toast.success("Đã xóa tour cũ và thêm phòng mới.");
    }
    setBookingRoomList((prev) => {
      if (prev.length > 0 && prev[0].hotelID !== room.hotelID) {
        toast.success("Đã xóa phòng cũ và thêm phòng mới từ khách sạn khác.");
        return [room];
      }
      return prev.some((r) => r.roomID === room.roomID)
        ? prev
        : [...prev, room];
    });
  };

  const addTourToBookingList = (tour: TourType) => {
    if (bookingRoomList.length > 0) {
      setBookingRoomList([]);
      toast.success("Đã xóa phòng cũ và thêm tour mới.");
    } else {
      toast.success("Đã chọn tour mới, tour cũ bị xóa.");
    }
    setBookingTourList([tour]);
  };

  const removeToBookingList = (roomID: string) => {
    setBookingRoomList((prev) => prev.filter((r) => r.roomID !== roomID));
  };

  const removeAllBookingList = () => {
    setBookingRoomList([]);
    setBookingTourList([]);
  };

  return (
    <BookingRoomContext.Provider
      value={{
        bookingRoomList,
        bookingTourList,
        addHotelToBookingList,
        addTourToBookingList,
        removeToBookingList,
        removeAllBookingList,
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
