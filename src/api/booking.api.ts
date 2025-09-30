import type { BookingResponse } from "../types/response/booking.type";
import type { BookingCreateType } from "../types/schemas/booking.schema";
import axiosInstance from "../utils/AxisosInstance";

export const handleCreateBooking = async (
  data: BookingCreateType
): Promise<BookingResponse> => {
  try {
    const payload = {
      rooms: data.rooms,
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
