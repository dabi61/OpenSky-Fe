export const ScheduleStatus = {
  ACTIVE: "Active",
  END: "End",
  SUSPEND: "Suspend",
  REMOVED: "Removed",
} as const;

export type ScheduleStatus =
  (typeof ScheduleStatus)[keyof typeof ScheduleStatus];
