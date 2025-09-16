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
import type { StaffCreateType } from "../types/schemas/staff.schema";

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
  data: UserCreateType | StaffCreateType
): Promise<UserUpdateResponse> => {
  try {
    const formData = new FormData();
    if ("new_email" in data) {
      formData.append("email", data.new_email);
      formData.append("password", data.new_password);
    }

    if ("staff_email" in data) {
      formData.append("email", data.staff_email);
      formData.append("password", data.staff_password);
    }
    formData.append("fullName", data.fullname);
    if (data.phoneNumber)
      formData.append("phoneNumber", data.phoneNumber || "");
    if (data.citizenId) formData.append("citizenId", data.citizenId || "");
    if (data.dob) formData.append("dob", dayjs(data.dob).format("YYYY-MM-DD"));
    if (data.avatar) formData.append("avatar", data.avatar);
    if (data.role) formData.append("role", data.role);
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
    const res = await axiosInstance.put(`users/${id}`, formData);
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
  roles: Roles[],
  page: number,
  size: number
): Promise<UserPage> => {
  const roleParams = roles.map((r) => `roles=${r}`).join("&");
  const res = await axiosInstance(
    `users?page=${page}&limit=${size}&${roleParams}`
  );
  return res.data;
};

export const handleSearchUserByRole = async (
  keyword: string,
  roles: Roles[],
  page: number,
  size: number
): Promise<UserPage> => {
  const encodedKeyword = encodeURIComponent(keyword);

  const roleParams = roles.map((r) => `roles=${r}`).join("&");

  const res = await axiosInstance.get(
    `users/search?keyword=${encodedKeyword}&${roleParams}&page=${page}&size=${size}`
  );

  return res.data;
};
