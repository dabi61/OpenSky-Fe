export const RoomStatus = {
  AVAILABLE: "Available",
  OCCUPIED: "Occupied",
  MAINTENANCE: "Maintenance",
} as const;

export type RoomStatus = (typeof RoomStatus)[keyof typeof RoomStatus];
