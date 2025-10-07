import { useNavigate } from "react-router-dom";
import assets from "../assets";
import type { TourType } from "../types/response/tour.type";

type Props = {
  item: TourType;
};

function TourHomeItem({ item }: Props) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/tour_info/${item.tourID}`)}
      className="flex flex-col border-1 border-gray-300 cursor-pointer transition-shadow duration-300 hover:shadow-lg rounded-xl flex-shrink-0"
    >
      <div className="relative">
        <img
          src={item.firstImage || assets.logo}
          className="md:w-83 md:h-55 w-38 h-30 rounded-t-xl object-cover"
        />
        <div className="absolute top-0 left-0 font-semibold text-sm rounded-tl-xl rounded-br-xl bg-blue-400 text-white px-6 py-1.5  ">
          {item.province}
        </div>
      </div>

      <div className="p-2">
        <div className="font-semibold my-3">{item.tourName}</div>
        <div>
          {new Intl.NumberFormat("vi-VN").format(item.price)}
          <span className="text-blue-400"> VNĐ</span>
        </div>
      </div>
    </div>
  );
}

export default TourHomeItem;
