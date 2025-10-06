import { createContext, useContext, useState, type ReactNode } from "react";
import type { RefundPage, RefundType } from "../types/response/refund.type";
import {
  handleGetRefundByBill,
  handleGetRefundById,
  handleGetRefundByStatus,
  handleGetRufunds,
} from "../api/refund.api";
import { RefundStatus } from "../constants/RefundStatus";

type RefundContextType = {
  refundList: RefundType[];
  loading: boolean;
  selectedRefund: RefundType | null;
  setSelectedRefund: (refund: RefundType | null) => void;
  getAllRefunds: (page: number, limit: number) => Promise<RefundPage>;
  getRefundById: (id: string) => Promise<RefundType>;
  getRefundByBill: (id: string) => Promise<RefundType | null>;
  getRefundBySatus: (
    status: RefundStatus,
    page: number,
    limit: number
  ) => Promise<RefundPage>;
};

const RefundContext = createContext<RefundContextType | null>(null);

export const RefundProvider = ({ children }: { children: ReactNode }) => {
  const [refundList, setRefundList] = useState<RefundType[]>([]);
  const [selectedRefund, setSelectedRefund] = useState<RefundType | null>(null);
  const [loading, setLoading] = useState(false);

  const getAllRefunds = async (
    page: number,
    limit: number
  ): Promise<RefundPage> => {
    try {
      setLoading(true);
      const res = await handleGetRufunds(page, limit);
      setRefundList(res.refunds);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const getRefundBySatus = async (
    status: RefundStatus,
    page: number,
    limit: number
  ): Promise<RefundPage> => {
    try {
      setLoading(true);
      const res = await handleGetRefundByStatus(status, page, limit);
      if (res) setRefundList(res.refunds);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const getRefundById = async (id: string): Promise<RefundType> => {
    try {
      setLoading(true);
      const res = await handleGetRefundById(id);
      setSelectedRefund(res);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const getRefundByBill = async (id: string): Promise<RefundType | null> => {
    try {
      setLoading(true);
      const res = await handleGetRefundByBill(id);
      if ("billID" in res) {
        setSelectedRefund(res);
        return res;
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <RefundContext.Provider
      value={{
        refundList,
        selectedRefund,
        setSelectedRefund,
        getAllRefunds,
        loading,
        getRefundBySatus,
        getRefundById,
        getRefundByBill,
      }}
    >
      {children}
    </RefundContext.Provider>
  );
};

export const useRefund = () => {
  const context = useContext(RefundContext);
  if (!context) {
    throw new Error("useRefund must be used within RefundProvider");
  }
  return context;
};
