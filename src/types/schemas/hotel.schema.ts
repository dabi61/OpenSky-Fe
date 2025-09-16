import z from "zod";

export const HotelSchema = z.object({
  hotelName: z.string().nonempty("Vui lòng nhập tên khách sạn"),
  email: z.email("Vui lòng nhập địa chỉ email"),
  address: z
    .string()
    .nonempty("Vui lòng nhập địa chỉ")
    .regex(/^[^,]+(,\s*[^,]+){2,}$/, "Vui lòng nhập chi tiết địa chỉ"),
  description: z.string().nullable(),
  files: z.array(z.instanceof(File)).nullable(),
  longitude: z.number().nullable(),
  latitude: z.number().nullable(),
  province: z.string(),
});

export type HotelCreateValidateType = z.infer<typeof HotelSchema>;
