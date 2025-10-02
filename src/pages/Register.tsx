import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import assets from "../assets";
import {
  RegisterSchema,
  type RegisterType,
} from "../types/schemas/register.schema";
import { handleRegister } from "../api/auth.api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { reloadUser } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: RegisterType) => {
    const res = await handleRegister(data);
    if (res.success) {
      toast.success("Đăng ký thành công!");
      await reloadUser();
      navigate("/home");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="flex-1 w-full bg-gradient-to-r from-blue-100  via-blue-300 to-blue-500 flex items-center justify-center">
      <div className="rounded-3xl bg-white flex md:w-200 sm:mx-0 mx-5">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="sm:flex-1 w-full flex flex-col my-auto items-center p-5"
        >
          <div className="text-2xl font-bold flex justify-center items-center">
            Đăng ký
          </div>
          <div className="flex flex-col gap-2 w-full h-full">
            <div className="h-18">
              <TextField
                {...register("fullName")}
                label="Họ và tên"
                variant="outlined"
                fullWidth
                size="small"
                margin="normal"
                className="flex "
                InputLabelProps={{
                  shrink: true,
                }}
              />
              {errors.fullName && (
                <p className="text-red-500 text-[11px] mt-[-5px]">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="h-18">
              <TextField
                {...register("email")}
                label="Email"
                variant="outlined"
                fullWidth
                size="small"
                margin="normal"
                className="flex "
                InputLabelProps={{
                  shrink: true,
                }}
              />
              {errors.email && (
                <p className="text-red-500 text-[11px] mt-[-5px]">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="h-18">
              <TextField
                {...register("password")}
                label="Mật khẩu"
                fullWidth
                size="small"
                margin="normal"
                type="password"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              {errors.password && (
                <p className="text-red-500 text-[11px] mt-[-5px]">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="h-18">
              <TextField
                {...register("repassword")}
                label="Nhập lại mật khẩu"
                fullWidth
                size="small"
                margin="normal"
                type="password"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              {errors.repassword && (
                <p className="text-red-500 text-[11px] mt-[-5px]">
                  {errors.repassword.message}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between text-[0.8rem] w-full">
              <FormControlLabel
                control={<Checkbox />}
                label="Tôi đồng ý với cấc điều khoản của OpenSky"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: "0.875rem",
                  },
                }}
              />
            </div>
            <Button
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: "#3B82F6",
                "&:hover": {
                  backgroundColor: "#2563EB",
                },
              }}
            >
              Đăng ký
            </Button>
          </div>
        </form>
        <div className="flex-1 w-full overflow-hidden rounded-r-3xl">
          <img
            src={assets.home}
            className="w-full h-125 rounded-l-[100px] object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
