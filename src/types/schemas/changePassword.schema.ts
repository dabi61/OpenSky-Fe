import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().nonempty("Vui lòng nhập mật khẩu cũ của bạn!"),
    newPassword: z.string().min(8, "Mật khẩu ít nhất 8 ký tự!"),
    reNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.reNewPassword, {
    message: "Mật khẩu nhập lại không khớp!",
    path: ["reNewPassword"],
  });

export type ChangePasswordType = z.infer<typeof changePasswordSchema>;

export type ChangePasswordWithoutReType = Omit<
  ChangePasswordType,
  "reNewPassword"
>;
