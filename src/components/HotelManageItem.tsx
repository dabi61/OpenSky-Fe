import { Calendar, Edit, Eye, Mail, MapPin, Star, Trash2 } from "lucide-react";
import type { FC } from "react";
import type { HotelType } from "../types/response/hotel.type";
import dayjs from "dayjs";
import assets from "../assets";

type Props = {
  hotel: HotelType;
  onClick: () => void;
};

const HotelManageItem: FC<Props> = ({ hotel, onClick }: Props) => {
  return (
    <div
      className="bg-white rounded-lg shadow overflow-hidden"
      onClick={onClick}
    >
      <div className="relative h-48">
        <img
          src={hotel.firstImage || assets.logo}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              hotel.status === "Active"
                ? "bg-green-100 text-green-800"
                : hotel.status === "Inactive"
                ? "bg-gray-100 text-gray-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {hotel.status}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900">{hotel.hotelName}</h3>
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
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{hotel.address}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {hotel.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-1" />
            <span>{hotel.email}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{dayjs(hotel.createdAt).format("DD-MM-YY")}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* <img
              src={`https://ui-avatars.com/api/?name=${hotel.user.firstName}+${hotel.user.lastName}&background=random`}
              alt={`${hotel.user.firstName} ${hotel.user.lastName}`}
              className="h-8 w-8 rounded-full mr-2"
            /> */}
            {/* <span className="text-sm text-gray-600">
              {hotel.user.firstName} {hotel.user.lastName}
            </span> */}
          </div>

          <div className="flex space-x-2">
            {hotel.status !== "Inactive" && (
              <button className="p-2 text-gray-400 hover:text-green-600 rounded-full hover:bg-green-50">
                <Edit className="h-4 w-4" />
              </button>
            )}
            <button className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelManageItem;
