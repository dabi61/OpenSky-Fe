import { useEffect, useState, type FC } from "react";
import { useRoom } from "../contexts/RoomContext";
import { useParams } from "react-router-dom";
import { CircularProgress, Typography } from "@mui/material";

import useQueryState from "../hooks/useQueryState";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import HotelRoomManageItem from "../components/RoomManageItem";

const HotelRoomManage: FC = () => {
  const { id } = useParams();
  const { getRoomByHotel, loading, roomList } = useRoom();
  const [page, setPage] = useQueryState("page", "1" as string);
  const [totalPages, setTotalPages] = useState(0);

  const fetchRooms = async () => {
    try {
      if (id) {
        const data = await getRoomByHotel(id, parseInt(page), 15);
        setTotalPages(data.totalPages);
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
      <div className="room-list">
        {roomList && roomList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roomList.map((room) => (
              <HotelRoomManageItem room={room} key={room.roomID} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Home
              fontSize="large"
              className="text-gray-400 mb-4"
              style={{ fontSize: "4rem" }}
            />
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
