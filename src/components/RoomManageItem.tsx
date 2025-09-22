import {
  Card,
  CardContent,
  CardMedia,
  Divider,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { Home, MapPin, Users } from "lucide-react";
import type { FC } from "react";
import type { RoomType } from "../types/response/room.type";

type Props = {
  room: RoomType;
};

const HotelRoomManageItem: FC<Props> = ({ room }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "success";
      case "Occupied":
        return "error";
      case "Maintenance":
        return "warning";
      case "Reserved":
        return "info";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Available":
        return "Có sẵn";
      case "Occupied":
        return "Đang sử dụng";
      case "Maintenance":
        return "Bảo trì";
      case "Reserved":
        return "Đã đặt";
      default:
        return status;
    }
  };

  return (
    <Card className="flex flex-col md:flex-row hover:shadow-lg transition-all duration-300 rounded-lg bg-white h-auto md:h-48">
      <Box className="w-full md:w-1/3 relative">
        <CardMedia
          component="img"
          image={room.firstImage || "/default-room.jpg"}
          alt={room.roomName}
          className="w-full h-48 md:h-full object-cover"
        />
        <Box className="absolute top-2 right-2">
          <Chip
            label={getStatusText(room.status)}
            color={getStatusColor(room.status) as any}
            size="small"
            className="text-xs font-semibold"
          />
        </Box>
      </Box>

      <Box className="w-full md:w-2/3 flex flex-col">
        <CardContent className="p-4 flex-1 flex flex-col">
          <Box className="mb-2">
            <Typography
              variant="h6"
              className="font-bold text-gray-900 line-clamp-1 text-base md:text-lg"
            >
              {room.roomName}
            </Typography>
            <Typography
              variant="body2"
              className="text-blue-600 font-medium flex items-center mt-1 text-sm md:text-base"
            >
              <Home size={16} className="mr-1" /> {room.roomType}
            </Typography>
          </Box>

          <Divider className="my-2" />

          <Box className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 mt-2">
            <Box className="flex items-start sm:col-span-2">
              <MapPin
                size={16}
                className="text-gray-500 mr-2 mt-0.5 flex-shrink-0"
              />
              <Box className="min-w-0">
                <Typography variant="caption" className="text-gray-500 block">
                  Địa chỉ
                </Typography>
                <Typography
                  variant="body2"
                  className="text-gray-800 line-clamp-2 text-sm md:text-base"
                >
                  {room.address}
                </Typography>
              </Box>
            </Box>

            <Box className="flex items-center">
              <Users size={16} className="text-gray-500 mr-2" />
              <Box>
                <Typography variant="caption" className="text-gray-500 block">
                  Sức chứa
                </Typography>
                <Typography variant="body2" className="text-gray-800">
                  {room.maxPeople} người
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography variant="caption" className="text-gray-500 block">
                Giá mỗi đêm
              </Typography>
              <Typography
                variant="body2"
                className="font-bold text-blue-500 text-base md:text-lg"
              >
                {Intl.NumberFormat("vi-VN").format(room.price) + " VNĐ"}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};

export default HotelRoomManageItem;
