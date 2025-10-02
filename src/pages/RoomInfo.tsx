import { useEffect, type FC, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRoom } from "../contexts/RoomContext";
import {
  CardContent,
  Button,
  Chip,
  Typography,
  TextField,
  Box,
} from "@mui/material";
import { MapPin, Users, Bed, ChevronLeft, Calendar, Moon } from "lucide-react";
import OverlayReload from "../components/Loading";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";
import { useBooking } from "../contexts/BookingContext";
import type { RoomType } from "../types/response/room.type";

const RoomInfo: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRoomById, selectedRoom } = useRoom();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [nights, setNights] = useState<number>(1);
  const { setBill } = useBooking();
  useEffect(() => {
    const fetchRoom = async () => {
      if (id) {
        await getRoomById(id);
      }
    };
    fetchRoom();
  }, [id]);

  if (!selectedRoom) {
    return <OverlayReload />;
  }

  const { roomName, roomType, address, price, maxPeople, status, images } =
    selectedRoom;
  const summarySelectedRoom: RoomType = {
    ...selectedRoom,
    firstImage: selectedRoom.images[0].imageUrl,
  };
  const totalPrice = price * nights;

  const handleSubmitBill = () => {
    if (selectedRoom) {
      setBill({
        id: 1,
        type: "room",
        checkInDate: dayjs(startDate).toDate(), // convert về Date
        numberOfNights: 2,
        room: summarySelectedRoom,
      });
    }
    navigate(`/booking`);
  };

  return (
    <>
      <div className="bg-gray-50">
        <div className="sticky top-0 z-40 p-4">
          <div className="flex items-center gap-2 cursor-pointer">
            <div
              className="bg-blue-500 rounded-full p-1"
              onClick={() => navigate(`/hotel_info/${selectedRoom.hotelID}`)}
            >
              <ChevronLeft color="white" size={20} />
            </div>
            <div className="font-semibold">Quay lại</div>
          </div>
        </div>

        <div className="min-h-[calc(100vh-10rem)] flex flex-col">
          <div className="flex flex-col lg:flex-row gap-4 md:px-8 my-auto justify-center">
            <div className="lg:w-2/3">
              <div className="overflow-hidden mb-6 shadow-md rounded-2xl">
                <div className="relative aspect-video flex-1 mb-3 md:mb-0">
                  {images && images.length > 0 ? (
                    <img
                      src={images[selectedImageIndex].imageUrl}
                      alt={roomName}
                      className="w-full h-full object-contain rounded-2xl"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <Bed className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                {images && images.length > 1 && (
                  <div className="flex gap-2 pt-1 overflow-x-auto mt-5 pb-2 px-2 bg-transparent">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                          selectedImageIndex === index
                            ? "ring-2 ring-blue-500"
                            : "opacity-60"
                        }`}
                      >
                        <img
                          src={img.imageUrl}
                          alt={`${roomName} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:w-1/3 mt-[-30px] md:mt-0">
              <div className="shadow-lg rounded-2xl">
                <div className="flex lg:flex-row lg:items-start justify-between px-6 pt-6">
                  <div className="mb-4 lg:mb-0 flex flex-col gap-2">
                    <div className="font-bold text-gray-900 mb-2 text-3xl">
                      {roomName}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <Typography variant="body2">{address}</Typography>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-gray-400" />
                        <span>Tối đa: {maxPeople} người</span>
                      </div>
                    </div>
                  </div>
                  <Chip
                    label={roomType}
                    variant="outlined"
                    className="text-lg px-3 py-1 border-2"
                  />
                </div>

                <CardContent className="p-6">
                  <Box className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6">
                      <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale="vi"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                          <div className="lg:col-span-2">
                            <div className="flex items-center gap-2 mb-3">
                              <Typography
                                variant="subtitle1"
                                className="font-semibold text-gray-700"
                              >
                                Ngày nhận phòng
                              </Typography>
                            </div>
                            <DatePicker
                              value={startDate}
                              onChange={setStartDate}
                              format="DD/MM/YYYY"
                              minDate={dayjs()}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  size: "medium",
                                  placeholder: "Chọn ngày nhận phòng",
                                  InputProps: {
                                    startAdornment: (
                                      <Calendar className="w-5 h-5 mr-3" />
                                    ),
                                    className: "bg-gray-50 border-0 rounded-xl",
                                  },
                                },
                                popper: {
                                  className: "rounded-xl shadow-lg",
                                },
                              }}
                              className="[&_.MuiOutlinedInput-root]:rounded-xl [&_.MuiOutlinedInput-notchedOutline]:border-2 [&_.MuiOutlinedInput-notchedOutline]:border-gray-200 [&_.MuiOutlinedInput-root:hover_.MuiOutlinedInput-notchedOutline]:border-blue-300"
                            />
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Typography
                                variant="subtitle1"
                                className="font-semibold text-gray-700"
                              >
                                Số đêm
                              </Typography>
                            </div>
                            <TextField
                              fullWidth
                              size="medium"
                              type="number"
                              value={nights}
                              onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (value >= 1 && value <= 30) setNights(value);
                              }}
                              InputProps={{
                                startAdornment: (
                                  <Moon className="w-5 h-5 mr-3" />
                                ),
                                className:
                                  "bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-blue-300",
                              }}
                              inputProps={{
                                min: 1,
                                max: 30,
                                className: "text-center font-semibold",
                              }}
                              className="[&_.MuiOutlinedInput-root]:rounded-xl"
                            />
                          </div>
                        </div>
                      </LocalizationProvider>

                      {startDate && nights > 1 && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            <Typography
                              variant="subtitle1"
                              className="font-semibold text-gray-800"
                            >
                              Thông tin đặt phòng
                            </Typography>
                          </div>

                          <div className="flex gap-4 text-sm">
                            {startDate && (
                              <>
                                <div className="bg-white rounded-lg p-3 flex-1 shadow-sm border border-gray-100">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                    <span className="font-semibold text-gray-600">
                                      Nhận phòng
                                    </span>
                                  </div>
                                  <div className="text-lg font-bold text-gray-800">
                                    {startDate.format("DD/MM/YYYY")}
                                  </div>
                                </div>

                                <div className="bg-white rounded-lg p-3 flex-1 shadow-sm border border-gray-100">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Calendar className="w-4 h-4 text-green-500" />
                                    <span className="font-semibold text-gray-600">
                                      Trả phòng
                                    </span>
                                  </div>
                                  <div className="text-lg font-bold text-gray-800">
                                    {startDate
                                      .add(nights, "day")
                                      .format("DD/MM/YYYY")}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </Box>

                  <div className="text-center mb-6">
                    <div className="flex items-end justify-center gap-2 mb-2">
                      <div className="font-semibold text-blue-500 text-4xl">
                        {Intl.NumberFormat("vi-VN").format(price) + " VNĐ"}
                      </div>
                      <div className="text-sm mb-1">/ đêm</div>
                    </div>

                    {(startDate || nights > 1) && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                        <Typography
                          variant="body2"
                          className="text-gray-600 mb-1"
                        >
                          Tổng tiền ({nights} đêm):
                        </Typography>
                        <div className="font-bold text-green-600 text-2xl">
                          {Intl.NumberFormat("vi-VN").format(totalPrice) +
                            " VNĐ"}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Button
                      variant="contained"
                      fullWidth
                      className="bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                      disabled={status !== "Available" || !startDate}
                      onClick={handleSubmitBill}
                    >
                      {startDate
                        ? `Đặt phòng ${nights} đêm`
                        : "Vui lòng chọn ngày nhận phòng"}
                    </Button>
                  </div>
                </CardContent>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomInfo;
