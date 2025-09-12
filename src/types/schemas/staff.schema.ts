import z from "zod";
import { Roles } from "../../constants/role";

export const StaffSchema = z.object({
  staff_email: z
    .string()
    .nonempty("Vui lòng nhập email!")
    .email("Email không hợp lệ!"),
  staff_password: z.string().min(8, "Mật khẩu ít nhất 8 ký tự!"),
  fullname: z.string().nonempty("Vui lòng nhập thông tin người dùng!"),
  phoneNumber: z
    .string()
    .nonempty("Vui lòng nhập số điện thoại")
    .refine(
      (val) => !val || /^0\d{9,10}$/.test(val),
      "Số điện thoại không hợp lệ!"
    ),
  citizenId: z
    .string()
    .nonempty("Vui lòng nhập CCCD/CMND")
    .refine((val) => !val || /^\d{12}$/.test(val), "Số CCCD không hợp lệ!"),
  dob: z
    .date()
    .nullable()
    .optional()
    .refine((date) => !date || date <= new Date(), {
      message: "Ngày sinh không hợp lệ",
    }),
  role: z.enum(Object.values(Roles) as [Roles, ...Roles[]], {
    message: "Vui lòng chọn role của bạn!",
  }),
  avatar: z
    .instanceof(File, { message: "Vui lòng chọn file!" })
    .refine((file) => file.size > 0, "File không hợp lệ!"),
});

export const StaffCreateSchema = StaffSchema;
export type StaffCreateType = z.infer<typeof StaffCreateSchema>;

export const StaffUpdateSchema = StaffSchema.omit({
  staff_email: true,
  staff_password: true,
  avatar: true,
})
  .extend({
    staff_email: z.string().email("Email không hợp lệ").optional(),
    staff_password: z.string().min(8, "Mật khẩu ít nhất 8 ký tự").optional(),
    avatar: z.instanceof(File).optional(),
  })
  .partial();

export type StaffUpdateType = z.infer<typeof StaffUpdateSchema>;
