import { useEffect, useState, type FC } from "react";
import { useRoom } from "../contexts/RoomContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CircularProgress, Typography } from "@mui/material";

import useQueryState from "../hooks/useQueryState";
import { ChevronLeft, ChevronRight, Funnel, Plus, Search } from "lucide-react";
import HotelRoomManageItem from "../components/RoomManageItem";
import { useHotel } from "../contexts/HotelContext";
import { RoomStatus } from "../constants/RoomStatus";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

const HotelRoomManage: FC = () => {
  const { id } = useParams();
  const { getMyHotel } = useHotel();
  const { getRoomByHotel, loading, roomList } = useRoom();
  const [page, setPage] = useQueryState("page", "1" as string);
  const [totalPages, setTotalPages] = useState(0);
  const location = useLocation().pathname;
  // const [selectedStatus, setSelectedStatus] =
  //   useOptionalQueryState<RoomStatus>("status");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();

  const fetchRooms = async () => {
    try {
      if (id) {
        const data = await getRoomByHotel(id, parseInt(page), 15);
        setTotalPages(data.totalPages);
      }
      if (location === `/my_hotel/room_manage`) {
        const res = await getMyHotel();
        await getRoomByHotel(res.hotelID, parseInt(page), 15);
      }
    } catch (error) {
      console.error("Failed to fetch tour:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [page]);

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <CircularProgress size="3rem" color="primary" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className=" mx-auto">
        <div className="  mb-8 ">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute  left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search hotels by name or province..."
                className="pl-10 pr-4 py-2 rounded-lg shadow border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Popover className="p-2 border border-gray-300 rounded-lg shadow">
              <PopoverButton className="block text-sm/6 font-semibold cursor-pointer text-white/50 focus:outline-none data-active:text-white data-focus:outline data-focus:outline-white data-hover:text-white">
                <Funnel className="text-gray-500 " />
              </PopoverButton>

              <PopoverPanel
                transition
                anchor="bottom start"
                className="divide-y border bg-white shadow-2xl border-gray-100 divide-white/5 rounded-xl text-sm/6 transition duration-200 ease-in-out [--anchor-gap:--spacing(5)] data-closed:-translate-y-1 data-closed:opacity-0"
              >
                {({ close }) => (
                  <>
                    <div
                      key="all"
                      onClick={() => {
                        close();
                      }}
                      className="block rounded-lg px-3 pr-10 py-2 transition hover:bg-gray-100 cursor-pointer"
                    >
                      All
                    </div>

                    {(Object.values(RoomStatus) as RoomStatus[])
                      .filter(
                        (status): status is Exclude<RoomStatus, "Removed"> =>
                          status !== RoomStatus.REMOVED
                      )
                      .map((status) => (
                        <div
                          key={status}
                          onClick={() => {
                            // setSelectedStatus(status);
                            close();
                          }}
                          className="block rounded-lg px-3 pr-10 py-2 transition hover:bg-gray-100 cursor-pointer"
                        >
                          {status}
                        </div>
                      ))}
                  </>
                )}
              </PopoverPanel>
            </Popover>
            {location.includes("/my_hotel") && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate(`/my_hotel/room_create`)}
                  className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Room
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="room-list">
        {roomList && roomList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roomList.map((room) => (
              <HotelRoomManageItem
                room={room}
                key={room.roomID}
                onSuccess={() =>
                  getRoomByHotel(room.hotelID, parseInt(page), 15)
                }
                onClick={() => navigate(`/room_info/${room.roomID}`)}
                enableEdit={location.includes("my_hotel") ? true : false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Typography variant="h6" className="text-gray-500 mb-2">
              Chưa có phòng nào
            </Typography>
            <Typography variant="body2" className="text-gray-400">
              Khách sạn hiện chưa có phòng nào được thiết lập
            </Typography>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap gap-1 py-5 justify-center">
          <button
            onClick={() => setPage((parseInt(page) - 1).toString())}
            disabled={parseInt(page) === 1}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (parseInt(page) <= 2) {
              pageNum = i + 1;
            } else if (parseInt(page) >= totalPages - 3) {
              pageNum = totalPages - 5 + i;
            } else {
              pageNum = parseInt(page) - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum.toString())}
                className={`px-3 py-1 border rounded-md text-sm ${
                  parseInt(page) === pageNum
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setPage((parseInt(page) + 1).toString())}
            disabled={parseInt(page) === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default HotelRoomManage;
