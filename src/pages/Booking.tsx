import { Calendar, ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { User, Mail, Phone, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import type { UserVoucherType } from "../types/response/userVoucher.type";
import Modal from "../components/Modal";
import { handleGetActiveVouchersType } from "../api/userVoucher.api";
import dayjs from "dayjs";
import type { TourType } from "../types/response/tour.type";
import { type BookingRoomType } from "../contexts/BookingRoomContext";
import type { BookingCreateType } from "../types/schemas/booking.schema";
import { handleCreateBooking } from "../api/booking.api";
import { toast } from "sonner";
import { handleApplyVoucherToBill } from "../api/bill.api";
import type { BillApplyType } from "../types/schemas/bill.schema";

const Booking: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [voucherList, setVoucherList] = useState<UserVoucherType[]>([]);
  const [selectedVoucher, setSelectedVoucher] =
    useState<UserVoucherType | null>(null);
  const [openVoucherModal, setOpenVoucherModal] = useState(false);
  const location = useLocation();

  const roomBill: BookingRoomType = location.state;
  if (!roomBill || roomBill.roomList.length === 0) {
    return <Navigate to="/unauthorized" replace />;
  }

  const bookingTourList: TourType[] = JSON.parse(
    sessionStorage.getItem("bookingTourList") || "[]"
  );

  const bookingTour: TourType | null =
    bookingTourList.length > 0 ? bookingTourList[0] : null;

  useEffect(() => {
    const fetchMyVouchers = async () => {
      const res = await handleGetActiveVouchersType("Hotel", page, 6);
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
  }, [page]);

  const createBookingSubmit = async () => {
    const formData: BookingCreateType = {
      checkInDate: roomBill.checkInDate!,
      checkOutDate: dayjs(roomBill.checkInDate)
        .add(roomBill.numberOfNights, "day")
        .toDate(),
      rooms: roomBill.roomList.map((r) => ({ roomID: r.roomID })),
    };
    const res = await handleCreateBooking(formData);
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
    } else {
      toast.error(res.message);
    }
  };

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
              Xác Nhận Đặt Tour
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
                {bookingTour && (
                  <div className="space-y-4">
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 shadow-sm hover:shadow-md space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tên phòng:</span>
                          <span className="font-medium">
                            {bookingTour.tourName}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">Giá:</span>
                          <span className="font-medium">
                            {Intl.NumberFormat("vi-VN").format(
                              bookingTour.price
                            )}
                            VNĐ
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                      <span>Tổng cộng:</span>
                      <span className="text-blue-600">
                        {Intl.NumberFormat("vi-VN").format(
                          roomBill.totalPrice
                        ) + " VNĐ"}
                      </span>
                    </div>
                  </div>
                )}

                {roomBill.roomList && roomBill.roomList.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Khách sạn:</span>
                      <span className="font-medium">
                        {roomBill.roomList[0].hotelName}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {roomBill.roomList.map((room, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 shadow-sm hover:shadow-md space-y-3"
                        >
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tên phòng:</span>
                            <span className="font-medium">{room.roomName}</span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-gray-600">Loại:</span>
                            <span className="font-medium">
                              {room.roomType.charAt(0).toUpperCase() +
                                room.roomType.slice(1)}
                              ({room.maxPeople} người)
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-gray-600">Giá:</span>
                            <span className="font-medium">
                              {Intl.NumberFormat("vi-VN").format(room.price)}
                              VNĐ
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                      <span>Tổng cộng:</span>
                      <span className="text-blue-600">
                        {Intl.NumberFormat("vi-VN").format(
                          roomBill.totalPrice
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
                          roomBill.totalPrice
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
                            roomBill.totalPrice *
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
                            roomBill.totalPrice *
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
                  {voucher.voucherDescription || <div className="mt-4"></div>}
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
          {totalPages > 1 && voucherList.length > 0 && (
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
      </Modal>
    </>
  );
};

export default Booking;
