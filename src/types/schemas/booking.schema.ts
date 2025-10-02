import z from "zod";

export const BookingRoomSchema = z.object({
  roomID: z.string().uuid({
    message: "roomID phải là UUID hợp lệ",
  }),
  checkInDate: z
    .date({
      error: () => {
        return "Thời gian không hợp lệ";
      },
    })
    .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
      message: "Vui lòng nhập ngày bắt đầu hợp lệ",
    })
    .refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
      message: "Ngày bắt đầu không hợp lệ",
    }),
  checkOutDate: z
    .date({
      error: () => {
        return "Thời gian không hợp lệ";
      },
    })
    .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
      message: "Vui lòng nhập ngày kết thúc hợp lệ",
    }),
});
export type BookingRoomCreateType = z.infer<typeof BookingRoomSchema>;

export const BookingScheduleSchema = z.object({
  scheduleID: z.string().uuid({
    message: "scheduleID phải là UUID hợp lệ",
  }),
  numberOfGuests: z.number({
    error: () => {
      return "Số khách hàng không hợp lệ";
    },
  }),
});
export type BookingScheduleCreateType = z.infer<typeof BookingScheduleSchema>;
