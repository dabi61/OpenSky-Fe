import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { VoucherPage, VoucherType } from "../types/response/voucher.type";
import {
  handleGetAllVoucher,
  handleGetAvailableVoucher,
  handleGetUnsavedVoucher,
  handleGetVoucherById,
  handleGetVoucherByType,
} from "../api/voucher.api";
import type { VoucherEnum } from "../constants/VoucherEnum";

type VoucherContextType = {
  voucherList: VoucherType[];
  loading: boolean;
  selectedVoucher: VoucherType | null;
  getVoucherById: (id: string) => Promise<VoucherType>;
  getAvailableVoucher: (page: number, limit: number) => Promise<VoucherPage>;
  getAllVoucher: (page: number, limit: number) => Promise<VoucherPage>;

  getUnsavedVoucher: (page: number, limit: number) => Promise<VoucherPage>;
  getVoucherByType: (
    type: VoucherEnum,
    page: number,
    limit: number
  ) => Promise<VoucherPage>;
  setSelectedVoucher: Dispatch<SetStateAction<VoucherType | null>>;
};

const VoucherContext = createContext<VoucherContextType | null>(null);

export const VoucherProvider = ({ children }: { children: ReactNode }) => {
  const [voucherList, setVoucherList] = useState<VoucherType[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherType | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const getVoucherById = async (id: string): Promise<VoucherType> => {
    try {
      setLoading(true);
      const res = await handleGetVoucherById(id);
      setSelectedVoucher(res);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const getAvailableVoucher = async (
    page: number,
    limit: number
  ): Promise<VoucherPage> => {
    try {
      setLoading(true);
      const res = await handleGetAvailableVoucher(page, limit);
      setVoucherList(res.vouchers);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const getAllVoucher = async (
    page: number,
    limit: number
  ): Promise<VoucherPage> => {
    try {
      setLoading(true);
      const res = await handleGetAllVoucher(page, limit);
      setVoucherList(res.vouchers);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const getUnsavedVoucher = async (
    page: number,
    limit: number
  ): Promise<VoucherPage> => {
    try {
      setLoading(true);
      const res = await handleGetUnsavedVoucher(page, limit);
      setVoucherList(res.vouchers);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const getVoucherByType = async (
    type: VoucherEnum,
    page: number,
    limit: number
  ): Promise<VoucherPage> => {
    try {
      setLoading(true);
      const res = await handleGetVoucherByType(type, page, limit);
      setVoucherList(res.vouchers);
      return res;
    } finally {
      setLoading(false);
    }
  };

  return (
    <VoucherContext.Provider
      value={{
        voucherList,
        selectedVoucher,
        loading,
        getVoucherById,
        getAvailableVoucher,
        getVoucherByType,
        setSelectedVoucher,
        getUnsavedVoucher,
        getAllVoucher,
      }}
    >
      {children}
    </VoucherContext.Provider>
  );
};

export const useVoucher = () => {
  const context = useContext(VoucherContext);
  if (!context) {
    throw new Error("useVoucher must be used within an UserVoucher");
  }
  return context;
};
