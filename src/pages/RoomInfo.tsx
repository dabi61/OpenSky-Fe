import { useEffect, type FC, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRoom } from "../contexts/RoomContext";
import { CardContent, Button, Chip, Typography } from "@mui/material";
import { MapPin, Users, Bed, ChevronLeft } from "lucide-react";
import OverlayReload from "../components/Loading";
import RoomStackBooking from "../components/RoomStackBooking";
import type { RoomType } from "../types/response/room.type";

const RoomInfo: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRoomById, selectedRoom } = useRoom();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  const summaryRoom: RoomType = {
    ...selectedRoom,
    firstImage: images && images.length > 0 ? images[0].imageUrl : "",
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
              <div className="overflow-hidden mb-6 md:flex shadow-md rounded-2xl">
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
                  <div className="flex gap-2 pt-1 overflow-x-auto md:flex-col pb-2 px-2 bg-transparent">
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
                  <div className="text-center mb-6 flex items-end justify-center">
                    <div className="font-semibold text-blue-500 text-4xl">
                      {Intl.NumberFormat("vi-VN").format(price) + " VNĐ"}
                    </div>
                    <div className="text-sm mb-1">/ đêm</div>
                  </div>

                  <div className="space-y-4">
                    <Button
                      variant="contained"
                      fullWidth
                      className="bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                      disabled={status !== "Available"}
                      // onClick={() => addHotelToBookingList(summaryRoom)}
                    >
                      Đặt phòng ngay
                    </Button>
                  </div>
                </CardContent>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RoomStackBooking />
    </>
  );
};

export default RoomInfo;
