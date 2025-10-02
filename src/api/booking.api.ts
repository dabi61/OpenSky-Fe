import type { BookingResponse } from "../types/response/booking.type";
import type {
  BookingRoomCreateType,
  BookingScheduleCreateType,
} from "../types/schemas/booking.schema";
import axiosInstance from "../utils/AxisosInstance";

export const handleCreateRoomBooking = async (
  data: BookingRoomCreateType
): Promise<BookingResponse> => {
  try {
    const payload = {
      rooms: { roomId: data.roomID },
      checkInDate: data.checkInDate?.toISOString(),
      checkOutDate: data.checkOutDate?.toISOString(),
    };

    const res = await axiosInstance.post(`bookings/hotel`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    return {
      message: error?.response?.data?.message ?? "Cập nhật thất bại",
      bookingId: null,
      billId: null,
    };
  }
};

export const handleCreateScheduleBooking = async (
  data: BookingScheduleCreateType
): Promise<BookingResponse> => {
  try {
    const payload = {
      scheduleID: { roomId: data.scheduleID },
      numberOfGuests: data.numberOfGuests,
    };
    const res = await axiosInstance.post(`bookings/tour`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    return {
      message: error?.response?.data?.message ?? "Cập nhật thất bại",
      bookingId: null,
      billId: null,
    };
  }
};
