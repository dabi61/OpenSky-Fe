export const TourStatus = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
} as const;

export type TourStatus = (typeof TourStatus)[keyof typeof TourStatus];
