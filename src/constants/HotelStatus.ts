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

export const hotelStatusVi: Record<HotelStatus, string> = {
  [HotelStatus.ACTIVE]: "Hoạt động",
  [HotelStatus.INACTIVE]: "Không hoạt động",
  [HotelStatus.SUSPEND]: "Tạm dừng",
  [HotelStatus.REMOVED]: "Đã gỡ bỏ",
};

export type HotelStatus = (typeof HotelStatus)[keyof typeof HotelStatus];
