import { ChevronLeft } from "lucide-react";
import { useEffect, type FC } from "react";
import {
  Outlet,
  NavLink,
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useHotel } from "../contexts/HotelContext";
import { hotelStatusColors, hotelStatusVi } from "../constants/HotelStatus";
import OverlayReload from "../components/Loading";

const HotelEditAll: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const { getMyHotel, selectedHotel, getHotelById } = useHotel();

  useEffect(() => {
    const fetchHotel = async () => {
      if (id) {
        await getHotelById(id);
      } else {
        await getMyHotel();
      }
    };
    fetchHotel();
  }, []);

  if (!selectedHotel) {
    return <OverlayReload />;
  }

  return (
    <div>
      <div className="px-2 flex gap-4 justify-between items-center shadow">
        <div className="p-4 flex gap-4">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              location.includes("/my_hotel")
                ? navigate("/")
                : navigate("/manager/hotel");
            }}
          >
            <div className="bg-blue-500 rounded-full p-1">
              <ChevronLeft color="white" size={20} />
            </div>
            <div className="font-semibold">Quay lại</div>
          </div>

          <NavLink
            to={
              location.includes("/my_hotel")
                ? `/my_hotel/room_manage`
                : `/manager/room_manage/${id}`
            }
            className={({ isActive }) =>
              `px-4 py-2 rounded-md font-medium ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Room Manage
          </NavLink>

          <NavLink
            to={
              location.includes("/my_hotel")
                ? `/my_hotel/hotel_edit`
                : `/manager/hotel_edit/${id}`
            }
            className={({ isActive }) =>
              `px-4 py-2 rounded-md font-medium ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Hotel Edit
          </NavLink>
        </div>
        <div
          className={`px-4 py-2 rounded-md font-medium text-white ${
            hotelStatusColors[
              selectedHotel?.status as keyof typeof hotelStatusColors
            ] || "bg-gray-300"
          }`}
        >
          Trạng thái: {hotelStatusVi[selectedHotel!.status]}
        </div>
      </div>

      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default HotelEditAll;
