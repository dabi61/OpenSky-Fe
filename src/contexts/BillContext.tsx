import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { BillPage } from "../types/response/bill.type";

import type { BillType } from "../types/response/bill.type";
import {
  handleGetAllBill,
  handleGetBillById,
  handleGetBillByStatus,
  handleGetCurrentUserBill,
  handleSearchManageBill,
} from "../api/bill.api";
import type { BillStatus } from "../constants/BillStatus";

type BillContextType = {
  billList: BillType[];
  loading: boolean;
  keyword: string;
  setKeyword: Dispatch<SetStateAction<string>>;
  selectedBill: BillType | null;
  getBillById: (id: string) => Promise<BillType>;
  getAllBill: (page: number, size: number) => Promise<BillPage>;
  getCurrentUserBill: (page: number, size: number) => Promise<BillPage>;
  getBillBySatus: (
    status: BillStatus,
    page: number,
    limit: number
  ) => Promise<BillPage>;
  searchManageBill: (
    page: number,
    size: number,
    status?: BillStatus
  ) => Promise<BillPage>;
};

const BillContext = createContext<BillContextType | null>(null);

export const BillProvider = ({ children }: { children: ReactNode }) => {
  const [billList, setBillList] = useState<BillType[]>([]);
  const [selectedBill, setSelectedBill] = useState<BillType | null>(null);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

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

  const getBillBySatus = async (
    status: BillStatus,
    page: number,
    limit: number
  ): Promise<BillPage> => {
    try {
      setLoading(true);
      const res = await handleGetBillByStatus(status, page, limit);
      setBillList(res.bills);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const searchManageBill = async (
    page: number,
    size: number,
    status?: BillStatus
  ): Promise<BillPage> => {
    const res = await handleSearchManageBill(keyword, page, size, status);
    setBillList(res.bills);
    return res;
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
        keyword,
        setKeyword,
        loading,
        getBillById,
        getAllBill,
        getCurrentUserBill,
        getBillBySatus,
        searchManageBill,
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
