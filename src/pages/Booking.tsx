import { Calendar, ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { User, Mail, Phone, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import type {
  UserVoucherPage,
  UserVoucherType,
} from "../types/response/userVoucher.type";
import Modal from "../components/Modal";
import { handleGetActiveVouchersType } from "../api/userVoucher.api";
import dayjs from "dayjs";
import { toast } from "sonner";
import { handleApplyVoucherToBill } from "../api/bill.api";
import type { BillApplyType } from "../types/schemas/bill.schema";
import { useBooking, type BookingBill } from "../contexts/BookingContext";
import {
  handleCreateRoomBooking,
  handleCreateScheduleBooking,
} from "../api/booking.api";
import type {
  BookingRoomCreateType,
  BookingScheduleCreateType,
} from "../types/schemas/booking.schema";
import OverlayReload from "../components/Loading";
import { Typography } from "@mui/material";

const Booking: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [voucherList, setVoucherList] = useState<UserVoucherType[]>([]);
  const [selectedVoucher, setSelectedVoucher] =
    useState<UserVoucherType | null>(null);
  const [openVoucherModal, setOpenVoucherModal] = useState(false);
  const { bill, loading } = useBooking();

  useEffect(() => {
    const fetchMyVouchers = async () => {
      let res: UserVoucherPage;
      if (bill?.type === "room") {
        res = await handleGetActiveVouchersType("Hotel", page, 6);
      } else {
        res = await handleGetActiveVouchersType("Tour", page, 6);
      }
      if (res.userVouchers) {
        const mapped = res.userVouchers.map((v) => ({
          ...v,
          voucherStartDate: dayjs(v.voucherStartDate),
          voucherEndDate: dayjs(v.voucherEndDate),
          savedAt: dayjs(v.savedAt),
        }));
        setVoucherList(mapped);
        setTotalPages(res.totalPages);
      }
    };
    fetchMyVouchers();
  }, [page, bill]);

  if (loading) {
    return <OverlayReload />;
  }

  if (!bill) {
    return <Navigate to="/unauthorized" replace />;
  }

  const createBookingSubmit = async () => {
    let res;

    if (bill.type === "room") {
      const formData: BookingRoomCreateType = {
        roomID: bill.room?.roomID!,
        checkInDate: bill.checkInDate!,
        checkOutDate: dayjs(bill.checkInDate)
          .add(bill.numberOfNights, "day")
          .toDate(),
      };

      res = await handleCreateRoomBooking(formData);
    } else {
      const formData: BookingScheduleCreateType = {
        scheduleID: bill.schedule?.scheduleID!,
        numberOfGuests: bill.numberOfGuest,
      };

      res = await handleCreateScheduleBooking(formData);
    }

    if (res.bookingId && res.billId) {
      if (selectedVoucher) {
        const billForm: BillApplyType = {
          billID: res.billId,
          userVoucherID: selectedVoucher.userVoucherID,
        };
        const BillRes = await handleApplyVoucherToBill(billForm);

        if (!("billID" in BillRes)) {
          toast.error(
            BillRes.message || "Voucher của bạn không tồn tại hoặc đã hết hạn!"
          );
          return;
        }
      }
      toast.success(res.message);
      navigate(`/bill/${res.billId}`);
    } else {
      toast.error(res.message);
    }
  };

  const getBillTotalPrice = (bill: BookingBill): number => {
    if (bill.type === "room") {
      return (bill.room?.price || 0) * bill.numberOfNights;
    }
    return (bill.schedule?.tour.price || 0) * bill.numberOfGuest;
  };

  console.log(bill);

  return (
    <>
      <div className="min-h-screen bg-gray-50 ">
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl  px-4 py-6 flex flex-col">
            <div
              className="flex gap-2 cursor-pointer mb-6"
              onClick={() => navigate(-1)}
            >
              <div className="bg-blue-500 rounded-full p-1">
                <ChevronLeft color="white" size={20} />
              </div>
              <div className="font-semibold text-lg">Quay lại</div>
            </div>

            <h1 className="text-3xl font-bold text-gray-800">
              Xác Nhận hóa đơn
            </h1>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User size={20} />
                  Thông tin khách hàng
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Họ và tên
                      </label>
                      <div className="text-gray-800 font-medium">
                        {user?.fullName || "Chưa cập nhật"}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Email
                      </label>
                      <div className="text-gray-800 font-medium flex items-center gap-2">
                        <Mail size={16} />
                        {user?.email || "Chưa cập nhật"}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Số điện thoại
                      </label>
                      <div className="text-gray-800 font-medium flex items-center gap-2">
                        <Phone size={16} />
                        {user?.phoneNumber || "Chưa cập nhật"}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        CCCD/CMND
                      </label>
                      <div className="text-gray-800 font-medium">
                        {user?.citizenId || "Chưa cập nhật"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Thông tin hóa đơn
                </h2>
                {bill.type === "schedule" && (
                  <div className="space-y-4">
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 shadow-sm hover:shadow-md space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tên tour:</span>
                          <span className="font-medium">
                            {bill.schedule?.tour.tourName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Giá:</span>
                          <span className="font-medium">
                            {Intl.NumberFormat("vi-VN").format(
                              bill.schedule?.tour.price ?? 0
                            )}
                            VNĐ
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Số lượng:</span>
                          <span className="font-medium">
                            {bill.numberOfGuest} người
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                      <span>Tổng cộng:</span>
                      <span className="text-blue-600">
                        {Intl.NumberFormat("vi-VN").format(
                          getBillTotalPrice(bill)
                        ) + " VNĐ"}
                      </span>
                    </div>
                  </div>
                )}

                {bill.type === "room" && bill.room && bill.room && (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Khách sạn:</span>
                      <span className="font-medium">{bill.room.hotelName}</span>
                    </div>

                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 shadow-sm hover:shadow-md space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tên phòng:</span>
                          <span className="font-medium">
                            {bill.room.roomName}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">Loại:</span>
                          <span className="font-medium">
                            {bill.room.roomType.charAt(0).toUpperCase() +
                              bill.room.roomType.slice(1)}
                            ({bill.room.maxPeople} người)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Số đêm:</span>
                          <span className="font-medium">
                            {bill.numberOfNights}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">Giá:</span>
                          <span className="font-medium">
                            {Intl.NumberFormat("vi-VN").format(bill.room.price)}
                            VNĐ
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                      <span>Tổng cộng:</span>
                      <span className="text-blue-600">
                        {Intl.NumberFormat("vi-VN").format(
                          getBillTotalPrice(bill)
                        ) + " VNĐ"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1 w-full lg:w-100">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <CreditCard size={20} />
                  Thanh Toán
                </h3>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-lg font-semibold whitespace-nowrap">
                      <span>Tổng tiền:</span>
                      <span className="text-blue-600">
                        {Intl.NumberFormat("vi-VN").format(
                          getBillTotalPrice(bill)
                        ) + " VNĐ"}
                      </span>
                    </div>

                    {selectedVoucher && (
                      <div className="flex justify-between text-lg font-semibold whitespace-nowrap">
                        <span>
                          Giảm giá ({selectedVoucher.voucherPercent}%):
                        </span>
                        <span className="text-blue-600">
                          -
                          {Intl.NumberFormat("vi-VN").format(
                            getBillTotalPrice(bill) *
                              (selectedVoucher.voucherPercent / 100)
                          ) + " VNĐ"}
                        </span>
                      </div>
                    )}

                    {selectedVoucher && (
                      <div className="flex justify-between text-lg font-semibold whitespace-nowrap">
                        <span>Tổng thanh toán:</span>
                        <span className="text-blue-600">
                          {Intl.NumberFormat("vi-VN").format(
                            getBillTotalPrice(bill) *
                              (1 - selectedVoucher.voucherPercent / 100)
                          ) + " VNĐ"}
                        </span>
                      </div>
                    )}
                  </div>
                  {selectedVoucher && (
                    <div className="flex justify-between items-center w-full">
                      <div className="text-sm text-gray-700 flex whitespace-nowrap">
                        Voucher áp dụng: {selectedVoucher.voucherCode}
                      </div>
                      <div
                        className="text-blue-500 cursor-pointer hover:text-blue-600 text-xs underline underline-offset-2 transition-colors"
                        onClick={() => setOpenVoucherModal(true)}
                      >
                        Đổi Voucher
                      </div>
                    </div>
                  )}

                  {!selectedVoucher && (
                    <button
                      className="w-full bg-green-500 text-white py-2 rounded-md font-semibold hover:bg-green-600 transition-colors"
                      onClick={() => setOpenVoucherModal(true)}
                    >
                      Chọn Voucher
                    </button>
                  )}

                  <button
                    onClick={() => createBookingSubmit()}
                    className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Xác Nhận Đặt Tour
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    Bằng cách xác nhận, bạn đồng ý với các điều khoản và điều
                    kiện của chúng tôi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={openVoucherModal}
        onClose={() => setOpenVoucherModal(false)}
        title="Voucher của tôi"
      >
        <>
          {voucherList.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 flex-col gap-3 p-4">
                {voucherList.map((voucher) => (
                  <div
                    key={voucher.voucherID}
                    className="bg-white rounded-xl shadow-sm border cursor-pointer hover:scale-105 border-gray-200 p-3 hover:shadow-md transition-all"
                    onClick={() => {
                      setSelectedVoucher(voucher);
                      setOpenVoucherModal(false);
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <Tag className="w-4 h-4 text-blue-600" />
                        <code className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-xs font-mono font-semibold">
                          {voucher.voucherCode}
                        </code>
                        <span className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-xs font-mono font-semibold">
                          {voucher.voucherTableType}
                        </span>
                      </div>
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                        -{voucher.voucherPercent}%
                      </span>
                    </div>

                    <div className="text-gray-600 text-xs mb-3 line-clamp-2">
                      {voucher.voucherDescription || (
                        <div className="mt-4"></div>
                      )}
                    </div>

                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {voucher.voucherStartDate.format("DD/MM/YYYY")} →
                          {voucher.voucherEndDate.format("DD/MM/YYYY")}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <span
                        className={`px-1.5 py-0.5 rounded text-xs font-medium ${
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
                    </div>
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex flex-wrap gap-1 py-5 justify-center">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 2) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 3) {
                      pageNum = totalPages - 5 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-1 border rounded-md text-sm ${
                          page === pageNum
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="bg-gray-100 rounded-full p-6 mb-4">
                <Tag className="w-12 h-12 text-gray-400" />
              </div>
              <Typography
                variant="h6"
                className="text-gray-500 mb-2 text-center"
              >
                Không có voucher nào
              </Typography>
              <Typography
                variant="body2"
                className="text-gray-400 text-center max-w-sm"
              >
                Hiện tại bạn không có voucher nào khả dụng. Voucher sẽ xuất hiện
                ở đây khi bạn nhận được.
              </Typography>
            </div>
          )}
        </>
      </Modal>
    </>
  );
};

export default Booking;
