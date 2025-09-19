import { Edit, Trash2, MapPin, Users, Star, Image } from "lucide-react";
import { type FC, useState } from "react";
import type { TourType } from "../types/response/tour.type";

interface Props {
  tour: TourType;
  // onEdit: () => void;
  // onDelete: () => void;
  onClick: () => void;
}

const TourManageItem: FC<Props> = ({ tour, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="bg-white rounded-2xl flex overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div
          className="relative h-48 w-full overflow-hidden cursor-pointer"
          onClick={onClick}
        >
          {tour.firstImage && !imageError ? (
            <img
              src={tour.firstImage}
              alt={tour.tourName}
              className="w-80 h-full object-cover transition-transform duration-500 ease-out"
              style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
              <Image size={40} className="text-gray-400" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60"></div>

          <div className="absolute top-3 right-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                tour.status === "Active"
                  ? "bg-green-100 text-green-800"
                  : tour.status === "Inactive"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {tour.status}
            </span>
          </div>

          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2">
            <span className="font-bold text-blue-600">
              ${tour.price.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 w-full">
        <div className="flex justify-between items-start mb-3">
          <h3
            className="text-lg font-semibold text-gray-900 cursor-pointer line-clamp-1 hover:text-blue-600 transition-colors"
            onClick={onClick}
          >
            {tour.tourName}
          </h3>

          {tour.star > 0 && (
            <div className="flex items-center bg-yellow-50 rounded-full pl-1 pr-2 py-1">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-yellow-700 ml-1">
                {tour.star}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center text-gray-600 text-sm mb-3">
          <MapPin size={14} className="mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{tour.address}</span>
        </div>

        {tour.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {tour.description}
          </p>
        )}

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-gray-700 text-sm">
            <Users size={14} className="mr-1" />
            <span>Tối đa: {tour.maxPeople} người</span>
          </div>
        </div>

        <div className="flex space-x-2 pt-3 border-t border-gray-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // onEdit();
            }}
            className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium py-2 px-3 rounded-lg transition-colors text-sm"
          >
            <Edit size={16} />
            <span>Sửa</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // onDelete();
            }}
            className="flex-1 flex items-center justify-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 font-medium py-2 px-3 rounded-lg transition-colors text-sm"
          >
            <Trash2 size={16} />
            <span>Xóa</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourManageItem;
