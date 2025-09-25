export const VoucherEnum = {
  TOUR: "Tour",
  HOTEL: "Hotel",
} as const;

export type VoucherEnum = (typeof VoucherEnum)[keyof typeof VoucherEnum];
