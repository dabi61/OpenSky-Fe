import { Button } from "@mui/material";
import { CheckCircle, QrCode, RefreshCcw, XCircle } from "lucide-react";
import type { BillType } from "../types/response/bill.type";

export const PaymentStatusCard = ({
  onPay,
  bill,
}: {
  onPay: () => void;
  bill: BillType;
}) => {
  const generateQRCodeData = () => {
    const billInfo = {
      amount: bill.totalPrice,
      currency: "VND",
      billId: `BILL-${Date.now()}`,
      customerName: bill.user.fullName || "Khách hàng",
      customerEmail: bill.user.email || "",
      description:
        bill.billDetails.itemType === "Hotel"
          ? `Đặt phòng ${bill.billDetails.itemName}`
          : `Đặt tour ${bill.billDetails.itemName}`,
    };
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      JSON.stringify(billInfo)
    )}`;
  };
  switch (bill.status) {
    case "Pending":
      return (
        <div className="bg-blue-50 rounded-lg p-6 text-center shadow">
          <div className="flex items-center justify-center gap-2 mb-4">
            <QrCode className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-800">
              Quét mã để thanh toán
            </h3>
          </div>

          <div className="flex justify-center mb-4">
            <img
              src={generateQRCodeData()}
              alt="QR Code thanh toán"
              className="w-48 h-48 border-4 border-white rounded-lg shadow-md"
            />
          </div>

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
          <p className="text-xs text-blue-600 mt-4">
            Mã QR sẽ hết hạn sau 1 giờ
          </p>
        </div>
      );

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
