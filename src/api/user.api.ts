import type {
  UserPage,
  UserType,
  UserUpdateResponse,
} from "../types/response/user";
import axiosInstance from "../utils/AxisosInstance";
import dayjs from "dayjs";
import type { Roles } from "../constants/role";
import type {
  UserCreateType,
  UserUpdateType,
} from "../types/schemas/profile.schema";

export const handleGetUser = async (): Promise<UserType> => {
  const res = await axiosInstance.get("users/profile");
  return res.data;
};

export const handleUpdateCurrentUser = async (
  data: Partial<UserUpdateType>
): Promise<UserUpdateResponse> => {
  try {
    const formData = new FormData();
    if (data.fullname) formData.append("fullName", data.fullname);
    if (data.phoneNumber)
      formData.append("phoneNumber", data.phoneNumber || "");
    if (data.citizenId) formData.append("citizenId", data.citizenId || "");
    if (data.dob) formData.append("dob", dayjs(data.dob).format("YYYY-MM-DD"));
    if (data.avatar) formData.append("avatar", data.avatar);
    const res = await axiosInstance.put("/users/profile", formData);
    return res.data;
  } catch (error: any) {
    console.log(error);
    return {
      message: error?.response?.data?.message || "Cập nhật thất bại",
      profile: {} as UserType,
    };
  }
};

export const handleCreateUser = async (
  data: UserCreateType
): Promise<UserUpdateResponse> => {
  try {
    const formData = new FormData();
    formData.append("email", data.new_email);
    formData.append("password", data.new_password);
    formData.append("fullName", data.fullname);
    if (data.phoneNumber)
      formData.append("phoneNumber", data.phoneNumber || "");
    if (data.citizenId) formData.append("citizenId", data.citizenId || "");
    if (data.dob) formData.append("dob", dayjs(data.dob).format("YYYY-MM-DD"));
    if (data.avatar) formData.append("avatar", data.avatar);
    const res = await axiosInstance.post("/users", formData);
    return res.data;
  } catch (error: any) {
    return {
      message: error?.response?.data?.message || "Tạo thất bại",
      profile: {} as UserType,
    };
  }
};

export const handleUpdateUser = async (
  id: string,
  data: Partial<UserUpdateType>
): Promise<UserUpdateResponse> => {
  try {
    const formData = new FormData();
    if (data.fullname) formData.append("fullName", data.fullname);
    if (data.phoneNumber)
      formData.append("phoneNumber", data.phoneNumber || "");
    if (data.citizenId) formData.append("citizenId", data.citizenId || "");
    if (data.dob) formData.append("dob", dayjs(data.dob).format("YYYY-MM-DD"));
    if (data.avatar) formData.append("avatar", data.avatar);
    const res = await axiosInstance.put(`/users/${id}`, formData);
    return res.data;
  } catch (error: any) {
    console.log(error);
    return {
      message: error?.response?.data?.message || "Cập nhật thất bại",
      profile: {} as UserType,
    };
  }
};

export const handleGetUserByRole = async (
  role: Roles,
  page: number,
  size: number
): Promise<UserPage> => {
  const res = await axiosInstance(
    `users?role=${role}&page=${page}&size=${size}`
  );
  return res.data;
};

export const handleSearchUserByRole = async (
  keyword: string,
  role: Roles,
  page: number,
  size: number
): Promise<UserPage> => {
  const encodedKeyword = encodeURIComponent(keyword);
  const res = await axiosInstance.get(
    `users/search?keyword=${encodedKeyword}&role=${role}&page=${page}&size=${size}`
  );
  return res.data;
};
