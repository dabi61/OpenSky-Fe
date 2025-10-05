export type BookingResponse = {
  message: string;
  bookingId: string | null;
  billId: string | null;
};

export type BookingTourType = {
  bookingID: string;
  tourID: string;
  tourName: string;
};

export type BookingHotelType = {
  bookingID: string;
  hotelID: string;
  hotelName: string;
  hotelAddress: string;
};
