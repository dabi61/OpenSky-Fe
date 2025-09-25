import z from "zod";
import { VoucherEnum } from "../../constants/VoucherEnum";

export const VoucherSchema = z
  .object({
    code: z.string().nonempty("Vui lòng nhập mã voucher"),
    percent: z
      .number()
      .refine((val) => !isNaN(val), {
        message: "Vui lòng nhập phần trăm giảm giá đầy đủ",
      })
      .min(1, "Vui lòng nhập giá đầy đủ"),
    tableType: z.enum(
      Object.values(VoucherEnum) as [VoucherEnum, ...VoucherEnum[]],
      {
        message: "Vui lòng chọn loại voucher",
      }
    ),
    startDate: z
      .date()
      .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
        message: "Vui lòng nhập ngày bắt đầu hợp lệ",
      })
      .refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
        message: "Ngày bắt đầu không hợp lệ",
      }),
    endDate: z
      .date()
      .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
        message: "Vui lòng nhập ngày kết thúc hợp lệ",
      }),
    description: z.string(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.endDate > data.startDate;
      }
      return true;
    },
    {
      message: "Ngày kết thúc phải lớn hơn ngày bắt đầu",
      path: ["endDate"],
    }
  );

export type VoucherCreateValidateType = z.infer<typeof VoucherSchema>;

// Update schema
export const VoucherUpdateSchema = VoucherSchema.partial();
export type VoucherUpdateValidateType = z.infer<typeof VoucherUpdateSchema>;
