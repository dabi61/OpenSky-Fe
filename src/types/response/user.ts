import type { Dayjs } from "dayjs";

export type UserType = {
  userID: string;
  email: string;
  fullName: string;
  role: string;
  phoneNumber: string;
  citizenId: string;
  doB: Dayjs;
  avatarURL: string;
  createdAt: Dayjs;
};
