import type { UserType } from "../types/response/user";
import axiosInstance from "../utils/AxisosInstance";

export const handleGetUser = async (): Promise<UserType> => {
  const res = await axiosInstance.get("users/profile");
  console.log(res);
  return res.data;
};
