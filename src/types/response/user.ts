import type { Dayjs } from "dayjs";

export type UserType = {
  id: string;
  email: string;
  fullName: string;
  role: string;
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
