import z from "zod";

const RoomIDSchema = z.object({
  roomID: z.string().uuid({ message: "roomID phải là UUID hợp lệ" }),
});

export const BookingSchema = z.object({
  rooms: z.array(RoomIDSchema).nonempty({ message: "Phải có ít nhất 1 phòng" }),
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
export type BookingCreateType = z.infer<typeof BookingSchema>;
