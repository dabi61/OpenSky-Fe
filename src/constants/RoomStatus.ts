export const RoomStatus = {
  AVAILABLE: "Available",
  OCCUPIED: "Occupied",
  MAINTENANCE: "Maintenance",
  REMOVED: "Removed",
} as const;

export type RoomStatus = (typeof RoomStatus)[keyof typeof RoomStatus];
