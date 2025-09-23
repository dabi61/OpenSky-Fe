import z from "zod";
import { RoomStatus } from "../../constants/RoomStatus";

export const RoomSchema = z.object({
  roomName: z.string().nonempty("Vui lòng nhập tên phòng"),
  price: z
    .number()
    .refine((val) => !isNaN(val), { message: "Vui lòng nhập giá đầy đủ" })
    .min(1, "Vui lòng nhập giá đầy đủ"),
  roomType: z.string().nonempty("Vui lòng nhập loại phòng"),
  maxPeople: z
    .number()
    .min(1, "Số người tham gia không hợp lệ")
    .refine((val) => !isNaN(val), { message: "Vui lòng nhập giá đầy đủ" })
    .max(20, "Không được vượt quá 20 người"),
  address: z.string().nonempty("Vui lòng nhập địa chỉ"),
  files: z.array(z.instanceof(File)).nullable(),
});
export type RoomCreateValidateType = z.infer<typeof RoomSchema>;
export const RoomUpdateSchema = RoomSchema.extend({
  status: z.enum(RoomStatus),
}).partial();
export type RoomupdateValidateType = z.infer<typeof RoomUpdateSchema>;
