import axios from "axios";
import type { LoginType } from "../types/schemas/login.schema";
import Cookies from "js-cookie";
import { toast } from "sonner";
import type { RegisterType } from "../types/schemas/register.schema";
import axiosInstance from "../utils/AxisosInstance";
import type { ChangePasswordWithoutReType } from "../types/schemas/changePassword.schema";

export const handleLogin = async (req: LoginType) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}auth/login`,
      req
    );
    const access_token = res.data.accessToken;
    const refresh_token = res.data.refreshToken;
    if (req.remember) {
      Cookies.set("access_token", access_token, { expires: 1 });
      Cookies.set("refresh_token", refresh_token, { expires: 7 });
    } else {
      Cookies.set("access_token", access_token);
      Cookies.set("refresh_token", refresh_token);
    }

    return {
      success: true,
      access_token,
      refresh_token,
    };
  } catch (error: any) {
    const message = error.response?.data?.message;
    return {
      success: false,
      message,
    };
  }
};

export const handleRegister = async (req: RegisterType) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}auth/register`,
      req
    );

    if (res.data) {
      const loginData: LoginType = {
        email: req.email,
        password: req.password,
        remember: false,
      };
      return await handleLogin(loginData);
    }

    return {
      success: false,
      message: "Không nhận được phản hồi từ server",
    };
  } catch (error: any) {
    const message = error.response?.data?.message ?? "Lỗi không xác định";
    return {
      success: false,
      message,
    };
  }
};

export const handleRefresh = async () => {
  const refresh_token = Cookies.get("refresh_token");
  const res = await axios.post(`${import.meta.env.VITE_API_URL}auth/refresh`, {
    refreshToken: refresh_token,
  });
  return { access_token: res.data.accessToken };
};

export const handleLogout = async () => {
  try {
    const refresh_token = Cookies.get("refresh_token");

    if (!refresh_token) {
      toast.warning("Không tìm thấy refresh token, có thể bạn đã đăng xuất.");
      return;
    }

    await axios.post(`${import.meta.env.VITE_API_URL}auth/logout`, {
      refreshToken: refresh_token,
    });
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    toast.success("Đăng xuất thành công!");
    return {
      success: true,
    };
  } catch (error: any) {
    console.log(error);

    toast.error(
      error.response?.data?.message || "Đăng xuất thất bại, thử lại sau."
    );
    return {
      success: false,
    };
  }
};

export const handleChangePassword = async (
  data: ChangePasswordWithoutReType
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const res = await axiosInstance.post("auth/change-password", data);
    return {
      success: true,
      message: res.data.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Cập nhật thất bại!",
    };
  }
};
