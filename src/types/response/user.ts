import type { Dayjs } from "dayjs";
import type { Roles } from "../../constants/role";

export type UserType = {
  id: string;
  email: string;
  fullName: string;
  role: Roles;
  phoneNumber: string;
  citizenId: string;
  dob: Dayjs;
  avatarURL: string;
  createdAt: Dayjs;
};

export type UserUpdateResponse = {
  message: string;
  profile: UserType;
};

export type UserPage = {
  content: UserType[];
  totalPages: number;
  pageNumber: number;
  pageSize: number;
};

export type UserSummaryType = {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  avatarURL: string;
};
