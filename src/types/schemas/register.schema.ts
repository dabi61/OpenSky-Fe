import { z } from "zod";

export const RegisterSchema = z
  .object({
    fullname: z.string().nonempty("Vui lòng nhập thông tin người dùng!"),
    email: z.email("Vui lòng nhập email!"),
    passowrd: z.string().min(8, "Mật khẩu ít nhất 8 ký tự!"),
    repassword: z.string(),
  })

  .refine((data) => data.passowrd === data.repassword, {
    message: "Mật khẩu nhập lại không khớp!",
    path: ["repassword"],
  });

export type RegisterType = z.infer<typeof RegisterSchema>;
