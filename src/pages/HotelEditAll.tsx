import { ChevronLeft } from "lucide-react";
import type { FC } from "react";
import { Outlet, NavLink, useParams, useNavigate } from "react-router-dom";

const HotelEditAll: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <div className="p-4 flex gap-4 ">
        <div className="flex items-center gap-2 cursor-pointer">
          <div
            className="bg-blue-500 rounded-full p-1"
            onClick={() => navigate("manager/hotel")}
          >
            <ChevronLeft color="white" size={20} />
          </div>
          <div className="font-semibold">Quay lại</div>
        </div>

        <NavLink
          to={`/room_manage/${id}`}
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
          to={`/hotel_edit/${id}`}
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

      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default HotelEditAll;
