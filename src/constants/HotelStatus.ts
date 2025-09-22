export const HotelStatus = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  SUSPEND: "Suspend",
  REMOVED: "Removed",
} as const;

export const hotelStatusColors: Record<string, string> = {
  [HotelStatus.ACTIVE]: "bg-green-500",
  [HotelStatus.INACTIVE]: "bg-gray-400",
  [HotelStatus.SUSPEND]: "bg-yellow-500",
  [HotelStatus.REMOVED]: "bg-red-500",
};

export type HotelStatus = (typeof HotelStatus)[keyof typeof HotelStatus];
