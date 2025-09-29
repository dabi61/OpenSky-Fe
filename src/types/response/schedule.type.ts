import type { Dayjs } from "dayjs";
import type { ScheduleStatus } from "../../constants/ScheduleStatus";
import type { UserSummaryType } from "./user.type";

export type ScheduleType = {
  scheduleID: string;
  tourID: string;
  user: UserSummaryType;
  startTime: Dayjs;
  endTime: Dayjs;
  numberPeople: 20;
  status: ScheduleStatus;
  tourName: string;
  remainingSlots: null;
  createdAt: Date;
};

export type SchedulePage = {
  schedules: ScheduleType[];
  totalPages: number;
  pageNumber: number;
  pageSize: number;
};

export type ScheduleResponse = {
  message: string;
  scheduleId: string | null;
};
