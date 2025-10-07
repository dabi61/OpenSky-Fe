import type { Roles } from "../constants/role";
import type {
  BillStatisticResponse,
  ServiceStatisticResponse,
  UserStatisticResponse,
} from "../types/response/statistic.type";
import axiosInstance from "../utils/AxisosInstance";

const day = new Date();

export const getBIllStatistics = async (): Promise<BillStatisticResponse> => {
  const res = await axiosInstance.get(
    `statistics/bills/monthly?year=${day.getFullYear()}`
  );
  return res.data;
};

export const getUserStatistics = async (
  role: Roles
): Promise<UserStatisticResponse | null> => {
  if (role === "Admin" || role === "Hotel") return null;
  const res = await axiosInstance.get(
    `statistics/users/${role.toLowerCase()}s`
  );
  return res.data;
};

export const getServiceStatistics = async (
  type: "Hotel" | "Tour"
): Promise<ServiceStatisticResponse> => {
  const res = await axiosInstance.get(
    `statistics/${type}s?month=${day.getMonth()}&year=${day.getFullYear()}`
  );
  return res.data;
};
