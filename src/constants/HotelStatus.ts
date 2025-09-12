export const HotelStatus = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  SUSPEND: "Suspend",
  REMOVED: "Removed",
} as const;

export type HotelStatus = (typeof HotelStatus)[keyof typeof HotelStatus];
