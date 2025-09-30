import useEmblaCarousel from "embla-carousel-react";
import { useNavigate, useParams } from "react-router-dom";
import { useHotel } from "../contexts/HotelContext";
import { useEffect, useState } from "react";
import OverlayReload from "../components/Loading";
import { ChevronLeft, ChevronRight, Map, MapPin, Star, X } from "lucide-react";
import { useRoom } from "../contexts/RoomContext";
import useQueryState from "../hooks/useQueryState";
import { useUser } from "../contexts/UserContext";
import { Button } from "@mui/material";
import { handleUpdateHotelStatus } from "../api/hotel.api";
import type { HotelStatus } from "../constants/HotelStatus";
import { toast } from "sonner";
import RoomItem from "../components/RoomItem";
import RoomStackBooking from "../components/RoomStackBooking";
import { useBookingRoom } from "../contexts/BookingRoomContext";

const HotelInfo = () => {
  const { id } = useParams();
  const { getHotelById, loading, selectedHotel } = useHotel();
  const [totalPages, setTotalPages] = useState(0);
  const { getRoomByHotel, roomList } = useRoom();
  const { addRoom } = useBookingRoom();
  const [emblaRefImgs, emblaApi] = useEmblaCarousel({
    axis: "x",
    align: "center",
    dragFree: true,
    loop: true,
  });
  const [openMap, setOpenMap] = useState(false);
  const navigate = useNavigate();
  const [page, setPage] = useQueryState("page", "1" as string);
  const { user } = useUser();

  const fetchRooms = async () => {
    try {
      if (id) {
        await getHotelById(id).catch((err) =>
          console.error("Error fetching selectedHotel:", err)
        );
        const data = await getRoomByHotel(id, parseInt(page), 10);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch tour:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [id, page]);

  useEffect(() => {
    if (selectedHotel?.images?.length && emblaApi) {
      emblaApi.reInit();
    }
  }, [selectedHotel?.images, emblaApi]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  if (loading || !selectedHotel) {
    return <OverlayReload />;
  }

  const handleChangeStatus = async (status: HotelStatus) => {
    const res = await handleUpdateHotelStatus(selectedHotel?.hotelID, status);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <>
      <div className="relative w-full md:w-[90%] mx-auto">
        {selectedHotel.images.length > 0 && (
          <div className="relative my-5">
            {selectedHotel.images && selectedHotel.images.length > 0 && (
              <div className="embla overflow-hidden" ref={emblaRefImgs}>
                <div className="embla__container flex w-full">
                  {selectedHotel.images.map((img, index) => (
                    <div
                      key={index}
                      className="embla__slide basis-full shrink-0 mx-auto flex justify-center items-center w-auto h-100"
                    >
                      <img
                        src={img.imageUrl}
                        alt={`selectedHotel-img-${index}`}
                        className="w-fit h-100 object-contain rounded-2xl"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={scrollPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 cursor-pointer text-white p-2 rounded-full"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 cursor-pointer text-white p-2 rounded-full"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}

        <div className="w-full md:w-[90%] rounded-xl mt-3 md:rounded-2xl border px-4 md:px-10 border-blue-500 mx-auto mb-10 pb-5">
          <div className="font-bold text-2xl md:text-4xl pt-5 md:pt-20">
            {selectedHotel.hotelName}
          </div>
          <div className="flex items-end">
            <div className="flex items-center gap-2 ">
              <div className="text-sm mt-3 flex flex-col gap-1">
                {selectedHotel.user.phoneNumber && (
                  <div>Liên hệ: {selectedHotel.user.phoneNumber}</div>
                )}
                {selectedHotel.user.email && (
                  <div>Email: {selectedHotel.user.email}</div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-1 mt-3 md:mt-5 w-full">
            {Array.from({ length: selectedHotel.star }).map((_, index) => (
              <Star
                key={index}
                className="text-yellow-300"
                fill="currentColor"
                size={24}
              />
            ))}
          </div>

          {selectedHotel.latitude != null &&
            selectedHotel.longitude != null && (
              <div className="flex flex-col gap-5 mt-5">
                <div className="flex items-center">
                  <MapPin className="text-blue-500 mr-2 w-4 h-4 md:w-5 md:h-5" />
                  <div className="text-sm md:text-base">
                    Địa chỉ: {selectedHotel.address}
                  </div>

                  {!openMap ? (
                    <div
                      className="rounded-full border cursor-pointer border-blue-500 bg-blue-50 p-2 mx-2 text-blue-500 hover:bg-blue-100 transition"
                      onClick={() => setOpenMap(!openMap)}
                    >
                      <Map className="w-5 h-5" />
                    </div>
                  ) : (
                    <div
                      className="rounded-full border cursor-pointer border-red-500 bg-red-50 p-2 mx-2 text-red-500 hover:bg-red-100 transition"
                      onClick={() => setOpenMap(!openMap)}
                    >
                      <X className="w-5 h-5" />
                    </div>
                  )}
                </div>
                {openMap && selectedHotel.latitude != null && (
                  <iframe
                    className="rounded-2xl"
                    width="100%"
                    height="400"
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.google.com/maps?q=${selectedHotel.latitude},${selectedHotel.longitude}&hl=vi&z=15&output=embed`}
                  ></iframe>
                )}
              </div>
            )}

          {selectedHotel.description && (
            <div className="mt-4 md:mt-5">
              <div className="font-semibold text-base md:text-lg">Mô tả</div>
              <div className="mt-1 md:mt-2 text-gray-700 text-sm md:text-base">
                {selectedHotel.description}
              </div>
            </div>
          )}

          {roomList.length > 0 && (
            <div className="mt-4 md:mt-5 pb-5 md:pb-10">
              <div className="font-semibold text-base md:text-lg mb-2 md:mb-3">
                Phòng
              </div>

              <div>
                {roomList.map((room) => (
                  <RoomItem
                    key={room.roomID}
                    room={room}
                    onClick={() => addRoom(room)}
                  />
                ))}
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
          )}
          {(user?.role === "Admin" || user?.role === "Supervisor") && (
            <div className="flex w-110 gap-10 mx-auto mb-7 mt-10">
              {selectedHotel.status === "Active" && (
                <Button
                  variant="contained"
                  size="large"
                  color="error"
                  fullWidth
                  sx={{
                    "&:hover": { backgroundColor: "#DC2626" },
                  }}
                  onClick={() => handleChangeStatus("Suspend")}
                >
                  Tạm ngưng
                </Button>
              )}

              {selectedHotel.status === "Inactive" && (
                <>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      backgroundColor: "#3B82F6",
                      "&:hover": { backgroundColor: "#2563EB" },
                    }}
                    onClick={() => handleChangeStatus("Active")}
                  >
                    Duyệt
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    color="error"
                    fullWidth
                    sx={{
                      "&:hover": { backgroundColor: "#DC2626" },
                    }}
                    onClick={() => handleChangeStatus("Removed")}
                  >
                    Từ chối
                  </Button>
                </>
              )}

              {selectedHotel.status === "Suspend" && (
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{
                    backgroundColor: "#3B82F6",
                    "&:hover": { backgroundColor: "#2563EB" },
                  }}
                  onClick={() => handleChangeStatus("Active")}
                >
                  Mở lại
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      <RoomStackBooking />
    </>
  );
};
export default HotelInfo;
