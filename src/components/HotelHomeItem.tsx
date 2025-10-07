import { Star, MapPin } from "lucide-react";
import type { HotelType } from "../types/response/hotel.type";
import { useNavigate } from "react-router-dom";

type Props = {
  item: HotelType;
};

function HotelHomeItem({ item }: Props) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/hotel_info/${item.hotelID}`)}
      className="flex flex-col border border-gray-200 cursor-pointer transition-all duration-300 hover:shadow-lg rounded-xl flex-shrink-0 bg-white overflow-hidden"
    >
      <div className="relative">
        <img
          src={item.firstImage}
          className="md:w-83 md:h-55 w-38 h-30 object-cover"
        />
        <div
          className="absolute top-0 left-0 font-semibold text-sm rounded-tl-xl rounded-br-xl bg-blue-400 text-white px-2 py-2 
             max-w-[170px] overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {item.hotelName}
        </div>
      </div>

      <div className="p-3 flex flex-col flex-1 h-100">
        <div className="h-4">
          {item.star > 0 && (
            <div className="flex gap-1 mb-2">
              {Array.from({ length: item.star }).map((_, index) => (
                <Star
                  key={index}
                  className="w-4 h-4 text-yellow-400"
                  fill="currentColor"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-gray-600 pt-2">
          <MapPin className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium">{item.province}</span>
        </div>
      </div>
    </div>
  );
}

export default HotelHomeItem;
