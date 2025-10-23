import { Button } from "@mui/material";
import { CheckCircle, RefreshCcw, XCircle } from "lucide-react";
import type { BillType } from "../types/response/bill.type";
import { useUser } from "../contexts/UserContext";

export const PaymentStatusCard = ({
  onPay,
  bill,
}: {
  onPay: () => void;
  bill: BillType;
}) => {
  const { user } = useUser();

  switch (bill.status) {
    case "Pending":
      if (user?.role === "Customer") {
        return (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4"></div>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#3B82F6",
                "&:hover": { backgroundColor: "#2563EB" },
              }}
              onClick={onPay}
            >
              Xác nhận thanh toán
            </Button>
          </div>
        );
      }
      return null;

    case "Paid":
      return (
        <div className="bg-green-50 rounded-lg p-6 text-center shadow">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-green-800">
              Thanh toán thành công
            </h3>
          </div>
          <p className="text-sm text-green-700">
            Cảm ơn bạn đã hoàn tất thanh toán. Hóa đơn đã được xác nhận.
          </p>
        </div>
      );

    case "Cancelled":
      return (
        <div className="bg-red-50 rounded-lg p-6 text-center shadow">
          <div className="flex items-center justify-center gap-2 mb-4">
            <XCircle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-red-800">
              Hóa đơn đã bị hủy
            </h3>
          </div>
          <p className="text-sm text-red-700">
            Hóa đơn này đã bị hủy và không thể thanh toán nữa.
          </p>
        </div>
      );

    case "Refunded":
      return (
        <div className="bg-yellow-50 rounded-lg p-6 text-center shadow">
          <div className="flex items-center justify-center gap-2 mb-4">
            <RefreshCcw className="w-6 h-6 text-yellow-600" />
            <h3 className="text-lg font-semibold text-yellow-800">
              Giao dịch đã được hoàn tiền
            </h3>
          </div>
          <p className="text-sm text-yellow-700">
            Số tiền của bạn đã được hoàn lại. Vui lòng kiểm tra tài khoản.
          </p>
        </div>
      );

    default:
      return null;
  }
};
