import { createContext, useContext, useState, type ReactNode } from "react";
import type { BillPage } from "../types/response/bill.type";

import type { BillType } from "../types/response/bill.type";
import {
  handleGetAllBill,
  handleGetBillById,
  handleGetCurrentUserBill,
} from "../api/bill.api";

type BillContextType = {
  billList: BillType[];
  loading: boolean;
  selectedBill: BillType | null;
  getBillById: (id: string) => Promise<BillType>;
  getAllBill: (page: number, size: number) => Promise<BillPage>;
  getCurrentUserBill: (page: number, size: number) => Promise<BillPage>;
};

const BillContext = createContext<BillContextType | null>(null);

export const BillProvider = ({ children }: { children: ReactNode }) => {
  const [billList, setBillList] = useState<BillType[]>([]);
  const [selectedBill, setSelectedBill] = useState<BillType | null>(null);
  const [loading, setLoading] = useState(false);

  const getBillById = async (id: string): Promise<BillType> => {
    try {
      setLoading(true);
      const res = await handleGetBillById(id);
      setSelectedBill(res);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const getAllBill = async (page: number, size: number): Promise<BillPage> => {
    try {
      setLoading(true);
      const res = await handleGetAllBill(page, size);
      setBillList(res.bills);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUserBill = async (
    page: number,
    size: number
  ): Promise<BillPage> => {
    try {
      setLoading(true);
      const res = await handleGetCurrentUserBill(page, size);
      setBillList(res.bills);
      return res;
    } finally {
      setLoading(false);
    }
  };

  return (
    <BillContext.Provider
      value={{
        billList,
        selectedBill,
        loading,
        getBillById,
        getAllBill,
        getCurrentUserBill,
      }}
    >
      {children}
    </BillContext.Provider>
  );
};

export const useBill = () => {
  const context = useContext(BillContext);
  if (!context) {
    throw new Error("useBill must be used within an UserBill");
  }
  return context;
};
