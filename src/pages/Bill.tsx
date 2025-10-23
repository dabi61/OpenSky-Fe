import { useEffect, useState, type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User, Mail, Phone, ChevronLeft, MapPin, Star } from "lucide-react";
import { useBooking } from "../contexts/BookingContext";
import { Navigate } from "react-router-dom";
import OverlayReload from "../components/Loading";
import { useBill } from "../contexts/BillContext";
import { handleCreateQR, handleScanQR } from "../api/bill.api";
import { toast } from "sonner";
import { PaymentStatusCard } from "../components/PaymentStatusCard";
import { Button, TextField } from "@mui/material";
import { useUser } from "../contexts/UserContext";
import Modal from "../components/Modal";
import {
  handleCancelBooking,
  handleGetHotelBookingById,
  handleGetTourBookingById,
} from "../api/booking.api";
import { handleCreateRefund } from "../api/refund.api";
import dayjs from "dayjs";
import FeedbackModal from "../components/FeedbackCreateModal";
import type {
  BookingHotelType,
  BookingTourType,
} from "../types/response/booking.type";
import { useRefund } from "../contexts/RefundContext";
import { RefundStatus } from "../constants/RefundStatus";

const Bill: FC = () => {
  const navigate = useNavigate();
  const { bill } = useBooking();
  const { id } = useParams();
  const { selectedBill, getBillById, loading } = useBill();
  const [openCancelBill, setOpenCancelBill] = useState(false);
  const [openRefunDialog, setOpenRefundDialog] = useState(false);
  const [populationValue, setPopulationValue] = useState<
    BookingTourType | BookingHotelType | null
  >(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [openFeedback, setOpenFeedback] = useState(false);
  const { getRefundByBill, selectedRefund } = useRefund();
  const { user } = useUser();
  useEffect(() => {
    if (id) {
      getBillById(id);
      getRefundByBill(id);
    }
  }, [id]);

  useEffect(() => {
    const fetchPopulation = async () => {
      if (!selectedBill) return;

      let resPopulation: BookingTourType | BookingHotelType;

      if (user?.role === "Customer") {
        if (selectedBill.billDetails?.itemType === "Hotel") {
          resPopulation = await handleGetHotelBookingById(
            selectedBill.bookingID
          );
        } else {
          resPopulation = await handleGetTourBookingById(
            selectedBill.bookingID
          );
        }
        if (resPopulation.bookingID) {
          setPopulationValue(resPopulation);
        }
      }
    };

    fetchPopulation();
  }, [selectedBill]);

  if (loading || !selectedBill) {
    return <OverlayReload />;
  }

  if (!bill) {
    return <Navigate to="/unauthorized" replace />;
  }

  const handleConfirmCancelled = async () => {
    if (!reason.trim()) {
      setError("Vui lòng nhập lý do hủy đơn");
      return;
    }
    if (selectedBill.status === "Pending") {
      const res = await handleCancelBooking({
        reason: reason,
        bookingId: selectedBill.bookingID,
      });
      if (res.success) {
        toast.success(res.message);
        await getBillById(id!);
      } else {
        toast.error(res.message);
      }
      setOpenCancelBill(false);
    } else if (selectedBill.status === "Paid") {
      setOpenRefundDialog(true);
    }
  };

  const handleConfirmRefund = async () => {
    const res = await handleCreateRefund({
      billID: selectedBill.billID,
      description: reason,
    });
    if (res.refundID) {
      toast.success(res.message);
      await getBillById(id!);
      await getRefundByBill(id!);
    } else {
      toast.error(res.message);
    }
    setOpenRefundDialog(false);
    setOpenCancelBill(false);
  };

  function getRefundPercent(startTime: dayjs.Dayjs) {
    const today = dayjs();
    const diffDays = startTime.diff(today, "day");

    if (diffDays >= 7) return 100;
    if (diffDays >= 3) return 50;
    return 10;
  }
  const refundPercent = getRefundPercent(selectedBill.startTime);
  const refundAmount = (selectedBill.deposit * refundPercent) / 100;

  const handlePay = async () => {
    const res = await handleCreateQR(selectedBill.billID);
    if ("billId" in res) {
      const resPay = await handleScanQR(res.qrCode);
      if ("paidAt" in resPay) {
        toast.success(resPay.message);
        await getBillById(selectedBill.billID);
      } else {
        toast.error(resPay.message);
      }
    } else {
      toast.error(res.message);
    }
  };
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="md: w-ful px-4 py-6 flex flex-col">
          <div
            className="flex gap-2 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <div className="bg-blue-500 rounded-full p-1">
              <ChevronLeft color="white" size={20} />
            </div>
            <div className="font-semibold text-lg">Quay lại</div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <h2 className="text-2xl font-bold text-gray-800">
                  HÓA ĐƠN THANH TOÁN
                </h2>
              </div>
              <p className="text-gray-600">
                Cảm ơn bạn đã đặt dịch vụ với chúng tôi
              </p>
            </div>

            {/* Thay đổi từ grid 2 cột thành flex container */}
            <div className="flex flex-col gap-8">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <User size={20} />
                    Thông tin khách hàng
                  </h3>

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
                        <Mail size={16} />
                        {selectedBill.user.email || "Chưa cập nhật"}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Số điện thoại
                      </label>
                      <div className="text-gray-800 font-medium flex items-center gap-2">
                        <Phone size={16} />
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

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Thông tin dịch vụ
                  </h3>

                  {selectedBill.billDetails.itemType === "Tour" && (
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {selectedBill.billDetails.itemName}
                          </h4>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ngày khởi hành:</span>
                          <span className="font-medium">
                            {selectedBill.startTime.format("DD/MM/YYYY")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Số lượng khách:</span>
                          <span className="font-medium">
                            {selectedBill.billDetails.quantity} người
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Đơn giá:</span>
                          <span className="font-medium">
                            {Intl.NumberFormat("vi-VN").format(
                              selectedBill.billDetails.unitPrice
                            ) + " VNĐ"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedBill.billDetails.itemType === "Hotel" && (
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {selectedBill.billDetails.itemName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {selectedBill.billDetails.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Ngày nhận phòng:
                          </span>
                          <span className="font-medium">
                            {selectedBill.startTime.format("DD/MM/MYYYY")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ngày kết thúc:</span>
                          <span className="font-medium">
                            {selectedBill.endTime.format("DD/MM/MYYYY")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Đơn giá:</span>
                          <span className="font-medium">
                            {Intl.NumberFormat("vi-VN").format(
                              selectedBill.billDetails.unitPrice
                            ) + " VNĐ/đêm"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Tổng thanh toán
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Tổng tiền:</span>
                      <span className="font-semibold">
                        {Intl.NumberFormat("vi-VN").format(
                          selectedBill.originalTotalPrice
                        ) + " VNĐ"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Giảm giá:</span>
                      <span className="font-semibold text-green-600">
                        {Intl.NumberFormat("vi-VN").format(
                          selectedBill.originalTotalPrice *
                            ((selectedBill?.voucherInfo?.percent ?? 0) / 100)
                        ) + " VNĐ"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-bold text-gray-800">
                        Tổng cộng:
                      </span>
                      <span className="text-xl font-bold text-blue-600">
                        {Intl.NumberFormat("vi-VN").format(
                          selectedBill.totalPrice
                        )}{" "}
                        VNĐ
                      </span>
                    </div>
                    <div className="mt-5">
                      {selectedRefund &&
                      selectedRefund.status === RefundStatus.PENDING ? (
                        <div className="p-4 border flex flex-col gap-2 border-yellow-400 rounded-md bg-yellow-50">
                          <p className="font-semibold text-yellow-700">
                            Yêu cầu hoàn tiền đang chờ xử lý
                          </p>
                          <p>
                            Lý do hoàn tiền:{" "}
                            <strong className="text-gray-700 whitespace-pre-line">
                              {selectedRefund.description}
                            </strong>
                          </p>

                          <p>
                            Ngày tạo:{" "}
                            {new Date(
                              selectedRefund.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      ) : selectedRefund &&
                        selectedRefund.status === RefundStatus.COMPLETED ? (
                        <div className="p-4 border flex flex-col gap-2 border-green-400 rounded-md bg-green-50">
                          <p className="font-semibold text-green-700">
                            Đơn đã hoàn tiền
                          </p>
                          <p>
                            Tỷ lệ hoàn tiền:{" "}
                            <strong>{selectedRefund.refundPercentage}%</strong>
                          </p>
                          <p>
                            Số tiền hoàn:{" "}
                            <strong>
                              {Intl.NumberFormat("vi-VN").format(
                                selectedBill.totalPrice -
                                  selectedRefund.refundAmount
                              )}{" "}
                              VNĐ
                            </strong>
                          </p>
                          <p>
                            Ngày tạo:{" "}
                            {new Date(
                              selectedRefund.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      ) : selectedRefund &&
                        selectedRefund.status === RefundStatus.REJECTED ? (
                        <div className="p-4 border flex flex-col gap-2 border-red-400 rounded-md bg-red-50">
                          <p className="font-semibold text-red-700">
                            Yêu cầu hoàn tiền bị từ chối
                          </p>
                          <p>
                            Tỷ lệ hoàn tiền:{" "}
                            <strong>{selectedRefund.refundPercentage}%</strong>
                          </p>
                          <p>
                            Số tiền hoàn:{" "}
                            <strong>
                              {Intl.NumberFormat("vi-VN").format(
                                selectedBill.totalPrice -
                                  selectedRefund.refundAmount
                              )}{" "}
                              VNĐ
                            </strong>
                          </p>
                          <p>
                            Ngày tạo:{" "}
                            {new Date(
                              selectedRefund.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      ) : (
                        (selectedBill.status === "Pending" ||
                          selectedBill.status === "Paid") &&
                        user?.role === "Customer" && (
                          <Button
                            variant="contained"
                            fullWidth
                            color="error"
                            onClick={() => setOpenCancelBill(true)}
                          >
                            Hủy đơn
                          </Button>
                        )
                      )}
                    </div>

                    {selectedBill.status === "Paid" &&
                      user?.role === "Customer" &&
                      selectedBill.endTime.isBefore(dayjs()) && (
                        <div className="mt-5">
                          <Button
                            variant="contained"
                            fullWidth
                            color="warning"
                            startIcon={<Star size={20} />}
                            onClick={() => setOpenFeedback(true)}
                          >
                            Đánh giá
                          </Button>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
            <PaymentStatusCard bill={selectedBill} onPay={() => handlePay()} />

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Mọi thắc mắc xin liên hệ hotline: 1900 1234 hoặc email:
                support@company.com
              </p>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={openCancelBill}
        onClose={() => {
          setOpenCancelBill(false);
          setTimeout(() => {
            setError("");
            setReason("");
          }, 500);
        }}
        title="Xác nhận hủy đơn"
        onAgree={handleConfirmCancelled}
      >
        <TextField
          autoFocus
          multiline
          minRows={4}
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);

            if (error && e.target.value.trim() !== "") {
              setError("");
            }
          }}
          placeholder="Nhập lý do hủy đơn..."
          variant="outlined"
          fullWidth
          margin="normal"
          error={!!error}
          inputProps={{ maxLength: 500 }}
          helperText={error || `${reason.length}/500 ký tự`}
        />
      </Modal>
      <Modal
        title="Thông báo"
        description={`Khi bấm xác nhận bạn sẽ được hoàn ${refundPercent}% (${Intl.NumberFormat(
          "vi-VN"
        ).format(refundAmount)} VNĐ) cho đơn đặt phòng`}
        isOpen={openRefunDialog}
        onClose={() => setOpenRefundDialog(false)}
        onAgree={() => handleConfirmRefund()}
      />
      <FeedbackModal
        isOpen={openFeedback}
        onClose={() => setOpenFeedback(false)}
        targetId={
          populationValue
            ? "hotelID" in populationValue
              ? populationValue.hotelID
              : populationValue.tourID
            : ""
        }
        type={selectedBill.billDetails.itemType}
      />
    </>
  );
};

export default Bill;
