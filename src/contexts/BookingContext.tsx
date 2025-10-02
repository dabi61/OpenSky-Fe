import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Dexie, { type Table } from "dexie";
import type { RoomType } from "../types/response/room.type";
import type { ScheduleType } from "../types/response/schedule.type";

export type RoomBill = {
  type: "room";
  id?: number;
  checkInDate: Date | null;
  numberOfNights: number;
  room: RoomType | null;
};

export type ScheduleBill = {
  type: "schedule";
  id?: number;
  numberOfGuest: number;
  schedule: ScheduleType | null;
};

export type BookingBill = RoomBill | ScheduleBill;

class BookingDB extends Dexie {
  bill!: Table<BookingBill, number>;
  constructor() {
    super("BookingDB");
    this.version(1).stores({
      bill: "++id,type",
    });
  }
}
const db = new BookingDB();

type BookingContextType = {
  bill: BookingBill | null;
  setBill: (bill: BookingBill) => Promise<void>;
  loading: boolean;
};

const BookingContext = createContext<BookingContextType | null>(null);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bill, setBillState] = useState<BookingBill | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBill = async () => {
      const saved = await db.bill.get(1);
      if (saved) {
        if (saved.type === "room") {
          setBillState({
            ...saved,
            checkInDate: saved.checkInDate ? new Date(saved.checkInDate) : null,
          } as RoomBill);
        } else {
          setBillState(saved as ScheduleBill);
        }
      }
      setLoading(false);
    };
    loadBill();
  }, []);

  const setBill = async (newBill: BookingBill) => {
    setBillState(newBill);
    await db.bill.put({ ...newBill, id: 1 });
  };

  return (
    <BookingContext.Provider value={{ bill, setBill, loading }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
