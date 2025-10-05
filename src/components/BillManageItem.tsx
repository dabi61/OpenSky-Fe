import dayjs from "dayjs";
import type { BillType } from "../types/response/bill.type";
import { Calendar, Hotel, Tag, TentTree } from "lucide-react";
import assets from "../assets";
import { useNavigate } from "react-router-dom";

interface Props {
  bill: BillType;
}

const BillManageItem: React.FC<Props> = ({ bill }) => {
  const navigate = useNavigate();

  const getStatusText = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "Hoàn thành";
      case "PENDING":
        return "Đang chờ";
      case "CANCELLED":
        return "Đã hủy";
      case "REFUNDED":
        return "Đã hoàn tiền";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "REFUNDED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };
  return (
    <tr
      key={bill.billID}
      className="hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => navigate(`/bill/${bill.billID}`)}
    >
      <td className="px-4 py-5 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8">
            <img
              className="h-8 w-8 rounded-full"
              src={bill.user.avatarURL || assets.logo}
              alt={bill.user.fullName}
            />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">
              {bill.user.fullName}
            </div>
            <div className="text-xs text-gray-500">{bill.user.email}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 mb-1">
          {bill.billDetails.itemType === "Hotel" ? (
            <Hotel className="w-4 h-4 text-blue-600" />
          ) : (
            <TentTree className="w-4 h-4 text-green-600" />
          )}
          <span className="text-sm font-medium text-gray-900">
            {bill.billDetails.itemName}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          SL: {bill.billDetails.quantity}
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {formatCurrency(bill.totalPrice)}
        </div>
        {bill.discountAmount > 0 && (
          <div className="text-xs text-gray-500 line-through">
            {formatCurrency(bill.originalTotalPrice)}
          </div>
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        {bill.voucherInfo ? (
          <div className="flex items-center gap-2">
            <Tag className="w-3 h-3 text-green-600" />
            <div>
              <div className="text-sm font-medium text-gray-900">
                {bill.voucherInfo.code}
              </div>
              <div className="text-xs text-gray-500">
                -{bill.voucherInfo.percent}%
              </div>
            </div>
          </div>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
            bill.status
          )}`}
        >
          {getStatusText(bill.status)}
        </span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {dayjs(bill.createdAt).format("DD/MM/YYYY HH:mm")}
        </div>
      </td>
    </tr>
  );
};
export default BillManageItem;
