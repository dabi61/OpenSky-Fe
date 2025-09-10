export const Roles = {
  ADMIN: "Admin",
  SUPERVISOR: "Supervisor",
  TOURGUIDE: "TourGuide",
  HOTELMANAGER: "Hotel",
  CUSTOMER: "Customer",
} as const;

export type Roles = (typeof Roles)[keyof typeof Roles];
