import { FileText, MapPin, Trash2 } from "lucide-react";
import type { TourItineraryType } from "../types/response/tour_itinerary.type";
import type { FC } from "react";

type Props = {
  itinerary: TourItineraryType;
  onClick?: () => void;
  onDelete?: () => void;
  size?: "default" | "compact";
};

const TourItineraryItem: FC<Props> = ({
  itinerary,
  onClick,
  onDelete,
  size = "default",
}) => {
  if (size === "compact") {
    return (
      <div
        key={itinerary.itineraryID}
        className={`relative flex items-start p-3 rounded-lg transition-all
          border border-gray-200`}
      >
        <span className="absolute -left-2 top- w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-sm"></span>

        <div className="flex-1 ml-2">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="text-red-500 flex-shrink-0" size={16} />
            <p className="font-medium text-sm text-gray-800 truncate">
              {itinerary.location}{" "}
              <span className="text-gray-500">
                ({itinerary.dayNumber} Ngày)
              </span>
            </p>
          </div>

          <div className="flex items-start gap-2">
            <FileText
              className="text-green-500 mt-0.5 flex-shrink-0"
              size={14}
            />
            <p className="text-xs text-gray-600 line-clamp-2 leading-tight">
              {itinerary.description || "Không có mô tả"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      key={itinerary.itineraryID}
      className={`relative flex flex-col md:flex-row md:items-start rounded-xl gap-4 shadow-sm transition-all
        ${onClick && "cursor-pointer hover:shadow-md"}
        p-4 md:p-5 border border-gray-100`}
    >
      <div className="flex-1 ml-2 md:ml-0">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="text-red-500 flex-shrink-0" size={20} />
          <p className="font-semibold text-lg text-gray-800">
            {itinerary.location}{" "}
            <span className="text-gray-600">({itinerary.dayNumber} ngày)</span>
          </p>
        </div>

        <div className="flex items-start gap-2 text-gray-600">
          <FileText className="text-green-500 mt-1 flex-shrink-0" size={18} />
          <p className="leading-relaxed text-gray-700">
            {itinerary.description}
          </p>
        </div>
      </div>

      {onDelete && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className={`flex items-center justify-center p-2 rounded-lg transition-all opacity-100 text-red-400 hover:bg-red-50 hover:text-red-600"}`}
        >
          <Trash2 size={20} />
        </div>
      )}
    </div>
  );
};

export default TourItineraryItem;
