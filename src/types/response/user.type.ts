import type { Dayjs } from "dayjs";
import type { Roles } from "../../constants/role";

export type UserType = {
  userID: string;
  email: string;
  fullName: string;
  role: Roles;
  phoneNumber: string;
  citizenId: string;
  dob: Dayjs;
  avatarURL: string;
  createdAt: Dayjs;
};

export type UserUpdateCurrentResponse = {
  message: string;
  profile: UserType;
};

export type UserUpdateResponse = {
  message: string;
  user: UserType;
};

export type UserPage = {
  users: UserType[];
  totalPages: number;
  pageNumber: number;
  pageSize: number;
};

export type UserSummaryType = {
  userID: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  avatarURL: string;
  citizendId: string;
};
