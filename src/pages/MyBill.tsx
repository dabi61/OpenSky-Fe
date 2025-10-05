import { useEffect, useState, type FC } from "react";
import { useBill } from "../contexts/BillContext";
import OverlayReload from "../components/Loading";
import useQueryState from "../hooks/useQueryState";
import {
  CreditCard,
  Calendar,
  Hotel,
  CheckCircle,
  Clock,
  XCircle,
  User,
  TentTree,
} from "lucide-react";
import dayjs from "dayjs";
import type { BillType } from "../types/response/bill.type";
import type { BillStatus } from "../constants/BillStatus";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";

const MyBill: FC = () => {
  const { getCurrentUserBill, billList, loading } = useBill();
  const [page, setPage] = useQueryState("page", "1" as string);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const fetchBills = async () => {
    try {
      const res = await getCurrentUserBill(Number(page), 8);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error("Failed to fetch billList:", error);
    }
  };

  useEffect(() => {
    fetchBills();
  }, [page]);

  const getStatusConfig = (status: BillStatus) => {
    switch (status) {
      case "Paid":
        return {
          icon: CheckCircle,
          color: "text-green-600 bg-green-50 border-green-200",
          text: "Đã thanh toán",
        };
      case "Pending":
        return {
          icon: Clock,
          color: "text-yellow-600 bg-yellow-50 border-yellow-200",
          text: "Đang chờ",
        };
      case "Cancelled":
        return {
          icon: XCircle,
          color: "text-red-600 bg-red-50 border-red-200",
          text: "Đã hủy",
        };
      case "Refunded":
        return {
          icon: CheckCircle,
          color: "text-blue-600 bg-blue-50 border-blue-200",
          text: "Đã hoàn tiền",
        };
      default:
        return {
          icon: Clock,
          color: "text-gray-600 bg-gray-50 border-gray-200",
          text: status,
        };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getServiceIcon = (itemType: string) => {
    return itemType === "Hotel" ? Hotel : TentTree;
  };

  const getServiceColor = (itemType: string) => {
    return itemType === "Hotel"
      ? "text-blue-600 bg-blue-50"
      : "text-green-600 bg-green-50";
  };

  if (loading || !billList) {
    return <OverlayReload />;
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage.toString());
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 md:w-167">
        <div className="space-y-6">
          {billList.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
              <CreditCard className="mx-auto h-24 w-24 text-gray-300 mb-6" />
              <h3 className="text-2xl font-medium text-gray-900 mb-4">
                Chưa có đơn hàng nào
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                Các đơn hàng của bạn sẽ xuất hiện ở đây khi bạn thực hiện đặt
                phòng hoặc tour
              </p>
              <button className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-base">
                Khám phá dịch vụ
              </button>
            </div>
          ) : (
            billList.map((bill: BillType) => {
              const StatusIcon = getStatusConfig(bill.status).icon;
              const ServiceIcon = getServiceIcon(bill.billDetails.itemType);

              return (
                <div
                  onClick={() => navigate(`/bill/${bill.billID}`)}
                  key={bill.billID}
                  className="bg-white rounded-2xl cursor-pointer shadow-md border border-gray-200 p-7 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 mb-6">
                    <div className="flex items-start gap-5 flex-1">
                      <div
                        className={`p-4 rounded-2xl ${getServiceColor(
                          bill.billDetails.itemType
                        )}`}
                      >
                        <ServiceIcon className="w-8 h-8" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xl text-gray-900 mb-3">
                          {bill.billDetails.itemName}
                        </h3>
                        <div className="flex flex-col gap-4 text-base text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            <span>
                              {dayjs(bill.startTime).format("DD/MM/YYYY")} -{" "}
                              {dayjs(bill.endTime).format("DD/MM/YYYY")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            <span>{bill.billDetails.quantity} người</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-3 w-fit px-4 py-3 rounded-full border ${
                        getStatusConfig(bill.status).color
                      }`}
                    >
                      <StatusIcon className="w-5 h-5" />
                      <span className="text-base font-semibold whitespace-nowrap">
                        {getStatusConfig(bill.status).text}
                      </span>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-gray-100 flex justify-end">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="text-left">
                        <div className="text-3xl font-bold text-gray-900 ">
                          {formatCurrency(bill.totalPrice)}
                        </div>
                      </div>
                    </div>

                    {(bill.discountAmount > 0 || bill.voucherInfo) && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex flex-wrap gap-4 text-sm">
                          {bill.discountAmount > 0 && (
                            <div className="flex items-center gap-2 text-green-600">
                              <span className="font-semibold">
                                Tiết kiệm: {formatCurrency(bill.discountAmount)}
                              </span>
                            </div>
                          )}
                          {bill.voucherInfo && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">
                                Voucher áp dụng:
                              </span>
                              <span className="text-gray-900 font-semibold bg-yellow-50 px-3 py-1 rounded">
                                {bill.voucherInfo.code} (-
                                {bill.voucherInfo.percent}%)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="border-t border-gray-200 px-4 sm:px-6 py-4">
          <Pagination
            page={Number(page)}
            onChange={handlePageChange}
            totalPages={totalPages}
          />
        </div>
      </div>
    </div>
  );
};

export default MyBill;
