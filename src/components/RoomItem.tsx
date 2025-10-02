import { Button } from "@mui/material";
import type { RoomType } from "../types/response/room.type";
import { MapPin, Users, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { FC } from "react";

type Props = {
  room: RoomType;
  onClick?: () => void;
};

const RoomItem: FC<Props> = ({ room, onClick }) => {
  const navigate = useNavigate();
  return (
    <div className="w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 mb-4 overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/4">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-200">
              {room.firstImage ? (
                <img
                  src={room.firstImage}
                  alt={room.roomName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Eye className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-2/4 flex flex-col justify-between ">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {room.roomName}
              </h3>

              <div className="flex items-center gap-1 text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{room.address}</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-1 border border-gray-300 rounded-full text-xs text-gray-700">
                  {room.roomType}
                </span>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>Tối đa: {room.maxPeople} người</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/4 flex flex-col items-end justify-between">
            <div className="text-right flex items-end md:block">
              <div className="text-2xl font-bold text-green-600">
                {Intl.NumberFormat("vi-VN").format(room.price) + " VNĐ"}
              </div>
              <div className="text-sm text-gray-500 mb-1 md:mb-0">/ đêm</div>
            </div>
            <div className="mt-4 flex gap-2 justify-end whitespace-nowrap">
              <Button
                variant="outlined"
                startIcon={<Eye size={18} />}
                onClick={() => navigate(`/room_info/${room.roomID}`)}
                sx={{
                  backgroundColor: "#fff",
                  borderColor: "#D1D5DB",
                  color: "#374151",
                  "&:hover": {
                    backgroundColor: "#F9FAFB",
                    borderColor: "#9CA3AF",
                  },
                }}
              >
                Xem chi tiết
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#3B82F6",
                  "&:hover": {
                    backgroundColor: "#2563EB",
                  },
                }}
                type="submit"
                onClick={onClick}
              >
                Đặt phòng
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomItem;
