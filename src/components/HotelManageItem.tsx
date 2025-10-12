import { Calendar, Edit, MapPin, Star, Trash2 } from "lucide-react";
import type { FC } from "react";
import type { HotelType } from "../types/response/hotel.type";
import dayjs from "dayjs";
import assets from "../assets";
import { hotelStatusColors } from "../constants/HotelStatus";

type Props = {
  hotel: HotelType;
  onClick: () => void;
  onDelete: () => void;
  onEdit: () => void;
};

const HotelManageItem: FC<Props> = ({
  hotel,
  onClick,
  onDelete,
  onEdit,
}: Props) => {
  return (
    <div
      className="bg-white rounded-lg cursor-pointer shadow overflow-hidden"
      onClick={onClick}
    >
      <div className="relative h-48">
        <div
          className={`absolute right-0 m-2 px-2 py-1 text-sm rounded-2xl text-white ${
            hotelStatusColors[hotel.status] || "bg-gray-300"
          }`}
        >
          {hotel.status}
        </div>
        <img
          src={hotel.firstImage || assets.logo}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 truncate w-full">
            {hotel.hotelName}
          </h3>
          {hotel.star !== 0 && (
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < hotel.star
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="text-sm truncate w-full">{hotel.address}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {hotel.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <div className="flex justify-center items-center gap-2">
            <img
              className="w-7 rounded-full"
              src={
                hotel.user.avatarURL ||
                `${import.meta.env.VITE_AVATAR_API}${hotel.user.fullName}`
              }
              alt={hotel.user.fullName}
            />
            <div>{hotel.user.email}</div>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{dayjs(hotel.createdAt).format("DD-MM-YY")}</span>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <div className="flex space-x-2">
            {hotel.status !== "Inactive" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-2 cursor-pointer text-gray-400 hover:text-green-600 rounded-full hover:bg-green-50"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}
            <button
              className="p-2 text-gray-400 cursor-pointer hover:text-red-600 rounded-full hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelManageItem;
