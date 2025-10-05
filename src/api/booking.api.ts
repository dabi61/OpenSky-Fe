import type {
  BookingResponse,
  BookingTourType,
} from "../types/response/booking.type";
import type {
  BookingCancelType,
  BookingRoomCreateType,
  BookingScheduleCreateType,
} from "../types/schemas/booking.schema";
import axiosInstance from "../utils/AxisosInstance";

export const handleCreateRoomBooking = async (
  data: BookingRoomCreateType
): Promise<BookingResponse> => {
  try {
    const payload = {
      rooms: [{ roomID: data.roomID }],
      checkInDate: data.checkInDate?.toISOString(),
      checkOutDate: data.checkOutDate?.toISOString(),
    };
    console.log(payload);

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
      scheduleID: data.scheduleID,
      numberOfGuests: data.numberOfGuests,
    };
    console.log(payload);

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

export const handleCancelBooking = async (
  data: BookingCancelType
): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await axiosInstance.put(
      `bookings/${data.bookingId}/cancel?reason=${data.reason}`
    );
    return {
      success: true,
      message: res.data.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Hủy đơn thất bại!",
    };
  }
};

export const handleGetTourBookingById = async (
  id: string
): Promise<BookingTourType> => {
  const res = await axiosInstance.get(`bookings/tour/${id}`);
  console.log(res.data);

  return res.data;
};

export const handleGetHotelBookingById = async (
  id: string
): Promise<BookingTourType> => {
  const res = await axiosInstance.get(`bookings/hotel/${id}/detail`);
  console.log(res.data);

  return res.data;
};
