import z from "zod";

export const TourSchema = z.object({
  tourName: z.string().nonempty("Vui lòng nhập tên tour"),
  price: z
    .number()
    .refine((val) => !isNaN(val), { message: "Vui lòng nhập giá đầy đủ" })
    .min(1, "Vui lòng nhập giá đầy đủ"),
  description: z.string(),
  maxPeople: z
    .number()
    .min(1, "Số người tham gia không hợp lệ")
    .refine((val) => !isNaN(val), { message: "Vui lòng nhập giá đầy đủ" })
    .max(100, "Không được vượt quá 100 người"),
  address: z
    .string()
    .nonempty("Vui lòng nhập địa chỉ")
    .regex(/^[^,]+(,\s*[^,]+){2,}$/, "Vui lòng nhập chi tiết địa chỉ"),
  province: z.string(),
  files: z.array(z.instanceof(File)).nullable(),
});

export type TourCreateValidateType = z.infer<typeof TourSchema>;
export const TourUpdateSchema = TourSchema.partial();
export type TourUpdateValidateType = z.infer<typeof TourUpdateSchema>;
