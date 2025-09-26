import dayjs from "dayjs";
import { useEffect, useState } from "react";
import type { UserVoucherType } from "../types/response/userVoucher.type";
import { handleGetMyVouchers } from "../api/userVoucher.api";
import { Calendar, Clock, Tag } from "lucide-react";
import { Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

const UserVoucher = () => {
  const [voucherList, setVoucherList] = useState<UserVoucherType[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyVouchers = async () => {
      const res = await handleGetMyVouchers();
      if (res.userVouchers) {
        const mapped = res.userVouchers.map((v) => ({
          ...v,
          voucherStartDate: dayjs(v.voucherStartDate),
          voucherEndDate: dayjs(v.voucherEndDate),
          savedAt: dayjs(v.savedAt),
        }));
        setVoucherList(mapped);
      }
      setLoading(false);
    };
    fetchMyVouchers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10 w-[42rem] mx-auto">
        <CircularProgress size={24} color="primary" />
      </div>
    );
  }

  return (
    <div className="md:w-[42rem] w-[calc(100vw-1.7rem)] mx-auto px-4 py-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col gap-4">
        {voucherList.map((voucher) => (
          <div
            key={voucher.voucherID}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5 hover:shadow-md hover:scale-[1.01] transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-2">
                <Tag className="w-5 h-5 text-blue-600" />
                <code className="bg-blue-50 text-blue-700 px-2 py-1 rounded font-mono font-semibold text-sm">
                  {voucher.voucherCode}
                </code>
                <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded font-mono font-semibold text-sm">
                  {voucher.voucherTableType}
                </span>
              </div>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                -{voucher.voucherPercent}%
              </span>
            </div>

            <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-2">
              {voucher.voucherDescription || <div className="mt-6"></div>}
            </p>

            <div className="space-y-2 text-xs sm:text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {voucher.voucherStartDate.format("DD/MM/YYYY")} →{" "}
                  {voucher.voucherEndDate.format("DD/MM/YYYY")}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>
                  Lưu lúc: {voucher.savedAt.format("DD/MM/YYYY HH:mm")}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
              <span
                className={`px-2 py-1 rounded text-xs sm:text-sm font-medium ${
                  voucher.isUsed
                    ? "bg-gray-100 text-gray-600"
                    : voucher.voucherIsExpired
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {voucher.isUsed
                  ? "Đã sử dụng"
                  : voucher.voucherIsExpired
                  ? "Hết hạn"
                  : "Có thể sử dụng"}
              </span>

              <div className="flex items-center gap-3">
                {!voucher.isUsed && !voucher.voucherIsExpired && (
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#3B82F6",
                      "&:hover": {
                        backgroundColor: "#2563EB",
                      },
                    }}
                    type="submit"
                    onClick={() =>
                      voucher.voucherTableType === "Hotel"
                        ? navigate("/Hotel")
                        : navigate("/Tour")
                    }
                  >
                    Sử dụng
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserVoucher;
