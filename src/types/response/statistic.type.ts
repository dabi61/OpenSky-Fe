import type { Roles } from "../../constants/role";

export type BillStatisticResponse = {
  monthlyData: [
    {
      month: number;
      billCount: number;
      totoalAmount: number;
    }
  ];
};

export type UserStatisticResponse = {
  role: Roles;
  count: number;
};

export type ServiceStatisticResponse = {
  month: number;
  year: number;
  count: number;
};
