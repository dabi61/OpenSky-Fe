import z from "zod";
import type { Roles } from "../../constants/role";

export const UserSchema = z.object({
  fullname: z.string().nonempty("Vui lòng nhập thông tin người dùng!"),
  phoneNumber: z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) => !val || /^0\d{9,10}$/.test(val),
      "Số điện thoại không hợp lệ!"
    ),
  citizenId: z
    .string()
    .nullable()
    .optional()
    .refine((val) => !val || /^\d{12}$/.test(val), "Số CCCD không hợp lệ!"),
  dob: z
    .date()
    .nullable()
    .optional()
    .refine((date) => !date || date <= new Date(), {
      message: "Ngày sinh không hợp lệ",
    }),
});

export const UserCreateSchema = UserSchema.extend({
  new_email: z
    .string()
    .nonempty("Vui lòng nhập email!")
    .email("Email không hợp lệ!"),
  new_password: z.string().min(8, "Mật khẩu ít nhất 8 ký tự!"),
});

export const UserFormSchema = z.union([UserCreateSchema, UserSchema]);

export type UserFormType = z.infer<typeof UserFormSchema>;

export const UserUpdateSchema = UserSchema.partial();

export type UserValidateType = z.infer<typeof UserSchema>;
export type UserUpdateType = z.infer<typeof UserUpdateSchema> & {
  avatar?: File;
};

export type UserCreateValidateType = z.infer<typeof UserCreateSchema>;
export type UserCreateType = z.infer<typeof UserCreateSchema> & {
  avatar?: File;
  role: Roles;
};
