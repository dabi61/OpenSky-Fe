import { useEffect, type FC } from "react";
import { useRefund } from "../contexts/RefundContext";
import { useBill } from "../contexts/BillContext";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import OverlayReload from "../components/Loading";
import { Button } from "@mui/material";
import { handleApproveRefund, handleRejectRefund } from "../api/refund.api";
import { toast } from "sonner";

const RefundInfo: FC = () => {
  const { selectedRefund, getRefundById } = useRefund();
  const { selectedBill, getBillById } = useBill();
  const { id } = useParams();
  const fetchRefund = async () => {
    if (id) {
      const res = await getRefundById(id);
      if (res.billID) {
        await getBillById(res.billID);
      }
    }
  };
  useEffect(() => {
    fetchRefund();
  }, [id]);

  if (!selectedRefund || !selectedBill) {
    return <OverlayReload />;
  }

  const handleApprove = async () => {
    const res = await handleApproveRefund(selectedBill.billID);
    if (res.success) {
      toast.success(res.message);
      fetchRefund();
    } else {
      toast.error(res.message);
    }
  };

  const handleReject = async () => {
    const res = await handleRejectRefund(selectedBill.billID);
    if (res.success) {
      toast.success(res.message);
      fetchRefund();
    } else {
      toast.error(res.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Chi tiết yêu cầu hoàn tiền
            </h1>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              selectedRefund.status
            )}`}
          >
            {selectedRefund.status === "Completed"
              ? "Đã hoàn tiền"
              : selectedRefund.status === "Pending"
              ? "Đang xử lý"
              : selectedRefund.status === "Rejected"
              ? "Đã từ chối"
              : selectedRefund.status}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Thông tin hoàn tiền
          </h2>
          <div className="space-y-3">
            <div className="flex flex-col">
              <span className="text-gray-600">Mã hóa đơn</span>
              <span className="font-medium whitespace-nowrap">
                {selectedRefund.billID}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-600">Thông tin</span>
              <span className="font-medium">
                {selectedBill.billDetails.itemName}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Trạng thái</span>
              <span
                className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                  selectedRefund.status
                )}`}
              >
                {selectedRefund.status}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-600">Ngày tạo</span>
              <span className="font-medium">
                {dayjs(selectedBill.createdAt).format("DD/MM/YYYY HH:mm")}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Thông tin hóa đơn
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Họ và tên
              </label>
              <div className="text-gray-800 font-medium">
                {selectedBill.user.fullName || "Chưa cập nhật"}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Email
              </label>
              <div className="text-gray-800 font-medium flex items-center gap-2">
                {selectedBill.user.email || "Chưa cập nhật"}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Số điện thoại
              </label>
              <div className="text-gray-800 font-medium flex items-center gap-2">
                {selectedBill.user.phoneNumber || "Chưa cập nhật"}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                CCCD/CMND
              </label>
              <div className="text-gray-800 font-medium">
                {selectedBill.user.citizendId || "Chưa cập nhật"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Lý do hoàn tiền
          </h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 whitespace-pre-line">
              {selectedRefund.description}
            </p>
          </div>
        </div>

        {selectedRefund.description.includes("Refund Policy") && (
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Chính sách hoàn tiền
            </h2>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-blue-700">
                {
                  selectedRefund.description
                    .split("[Refund Policy:")[1]
                    ?.split("]")[0]
                }
              </p>
            </div>
          </div>
        )}
      </div>

      {selectedRefund.status === "Pending" && (
        <div className="flex justify-end gap-4 mt-6">
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#3B82F6",
              "&:hover": {
                backgroundColor: "#2563EB",
              },
              textTransform: "none",
              px: 3,
            }}
            onClick={handleApprove}
          >
            Duyệt
          </Button>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#EF4444",
              "&:hover": {
                backgroundColor: "#DC2626",
              },
              textTransform: "none",
              px: 3,
            }}
            onClick={handleReject}
          >
            Từ chối
          </Button>
        </div>
      )}
    </div>
  );
};

export default RefundInfo;
