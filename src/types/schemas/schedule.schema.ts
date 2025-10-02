import { z } from "zod";
import { ScheduleStatus } from "../../constants/ScheduleStatus";

export const ScheduleSchema = z
  .object({
    tourID: z.string().uuid({
      message: "tourID phải là UUID hợp lệ",
    }),
    userID: z.string().uuid({
      message: "userID phải là UUID hợp lệ",
    }),
    startTime: z
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
    endTime: z
      .date({
        error: () => {
          return "Thời gian không hợp lệ";
        },
      })
      .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
        message: "Vui lòng nhập ngày kết thúc hợp lệ",
      }),
  })
  .refine(
    (data) => {
      const start = new Date(data.startTime);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const minDate = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);
      return start > minDate;
    },
    {
      message: "ngày khởi hành phải lớn hơn hôm nay ít nhất 5 ngày",
      path: ["startTime"],
    }
  )
  .refine(
    (data) => {
      return new Date(data.endTime) > new Date(data.startTime);
    },
    {
      message: "ngày kết thúc phải lớn hơn ngày khởi hành",
      path: ["endTime"],
    }
  );

export type CreateScheduleType = z.infer<typeof ScheduleSchema>;

export const ScheduleUpdateSchema = z
  .object({
    userID: z.string().uuid({
      message: "userID phải là UUID hợp lệ",
    }),
    startTime: z
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
    endTime: z
      .date({
        error: () => {
          return "Thời gian không hợp lệ";
        },
      })
      .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
        message: "Vui lòng nhập ngày kết thúc hợp lệ",
      }),
    numberPeople: z
      .int("Số người phải là số nguyên")
      .positive("Số người phải lớn hơn 0")
      .max(1000, "Số người không được vượt quá 1000"),
    status: z.enum(ScheduleStatus, {
      error: () => {
        return "Vui lòng chọn trạng thái";
      },
    }),
  })
  .refine(
    (data) => {
      const start = new Date(data.startTime);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const minDate = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);
      return start > minDate;
    },
    {
      message: "ngày khởi hành phải lớn hơn hôm nay ít nhất 5 ngày",
      path: ["startTime"],
    }
  )
  .refine(
    (data) => {
      return new Date(data.endTime) > new Date(data.startTime);
    },
    {
      message: "ngày kết thúc phải lớn hơn ngày khởi hành",
      path: ["endTime"],
    }
  );
export type UpdateScheduleType = z.infer<typeof ScheduleUpdateSchema>;
