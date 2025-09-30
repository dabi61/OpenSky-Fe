import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { RoomType } from "../types/response/room.type";
import { toast } from "sonner";
import Dexie, { type Table } from "dexie";

export type BookingRoomType = {
  id?: number;
  checkInDate: Date | null;
  numberOfNights: number;
  roomList: RoomType[];
  totalPrice: number;
};

class BookingDB extends Dexie {
  roomBill!: Table<BookingRoomType, number>;

  constructor() {
    super("HotelBookingDB");
    this.version(1).stores({
      roomBill: "++id",
    });
  }
}

const db = new BookingDB();

type BookingRoomContextType = {
  roomBill: BookingRoomType;
  addRoom: (room: RoomType) => void;
  removeRoom: (roomID: string) => void;
  setCheckInDate: (date: Date) => void;
  setNumberOfNights: (nights: number) => void;
};

const BookingRoomContext = createContext<BookingRoomContextType | null>(null);

export const BookingRoomProvider = ({ children }: { children: ReactNode }) => {
  const [roomBill, setRoomBill] = useState<BookingRoomType>({
    id: 1,
    checkInDate: null,
    numberOfNights: 1,
    roomList: [],
    totalPrice: 0,
  });

  useEffect(() => {
    const loadRoomBill = async () => {
      try {
        const saved = await db.roomBill.get(1);
        console.log("Loaded from Dexie:", saved);
        if (saved) {
          setRoomBill({
            ...saved,
            checkInDate: saved.checkInDate ? new Date(saved.checkInDate) : null,
          });
        }
      } catch (error) {
        console.error("Error loading from Dexie:", error);
      }
    };
    loadRoomBill();
  }, []);

  useEffect(() => {
    const saveRoomBill = async () => {
      try {
        await db.roomBill.put(roomBill, 1);
        await db.roomBill.get(1);
      } catch (error) {
        console.error("Error saving to Dexie:", error);
      }
    };

    if (
      roomBill.roomList.length > 0 ||
      roomBill.checkInDate ||
      roomBill.numberOfNights > 1
    ) {
      saveRoomBill();
    }
  }, [roomBill]);

  const calculateTotalPrice = (
    roomList: RoomType[],
    numberOfNights: number
  ) => {
    return roomList.reduce((acc, room) => acc + room.price * numberOfNights, 0);
  };

  const addRoom = (room: RoomType) => {
    setRoomBill((prev) => {
      if (!prev) {
        return {
          hotelID: room.hotelID,
          checkInDate: null,
          numberOfNights: 1,
          roomList: [room],
          totalPrice: room.price,
        };
      }
      if (
        prev.roomList.length > 0 &&
        prev.roomList[0].hotelID !== room.hotelID
      ) {
        toast.error("Bạn chỉ có thể đặt phòng trong cùng một khách sạn!");
        return prev;
      }

      if (prev.roomList.some((r) => r.roomID === room.roomID)) {
        toast.warning("Phòng này đã được thêm!");
        return prev;
      }

      const updatedRoomList = [...prev.roomList, room];

      return {
        ...prev,
        roomList: updatedRoomList,
        totalPrice: calculateTotalPrice(updatedRoomList, prev.numberOfNights),
      };
    });
  };

  const removeRoom = (roomID: string) => {
    setRoomBill((prev) => {
      const updatedRoomList = prev.roomList.filter((r) => r.roomID !== roomID);

      return {
        ...prev,
        roomList: updatedRoomList,
        totalPrice: calculateTotalPrice(updatedRoomList, prev.numberOfNights),
      };
    });
  };

  const setCheckInDate = (date: Date) => {
    setRoomBill((prev) => (prev ? { ...prev, checkInDate: date } : prev));
  };

  const setNumberOfNights = (nights: number) => {
    setRoomBill((prev) =>
      prev
        ? {
            ...prev,
            numberOfNights: nights,
            totalPrice: calculateTotalPrice(prev.roomList, nights),
          }
        : prev
    );
  };

  return (
    <BookingRoomContext.Provider
      value={{
        addRoom,
        roomBill,
        removeRoom,
        setCheckInDate,
        setNumberOfNights,
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
