import useEmblaCarousel from "embla-carousel-react";
import { useNavigate, useParams } from "react-router-dom";
import { useHotel } from "../contexts/HotelContext";
import { useEffect } from "react";
import OverlayReload from "../components/Loading";
import { ChevronLeft, ChevronRight, MapPin, Star } from "lucide-react";
import { useRoom } from "../contexts/RoomContext";
import useQueryState from "../hooks/useQueryState";
import { useUser } from "../contexts/UserContext";
import { Button } from "@mui/material";
import { handleUpdateHotelStatus } from "../api/hotel.api";
import type { HotelStatus } from "../constants/HotelStatus";
import { toast } from "sonner";

const HotelInfo = () => {
  const { id } = useParams();

  const { getHotelById, loading, selectedHotel } = useHotel();
  const { getRoomByHotel, roomList } = useRoom();
  const [emblaRefImgs, emblaApi] = useEmblaCarousel({
    axis: "x",
    align: "center",
    dragFree: true,
    loop: true,
  });
  const navigate = useNavigate();
  const [page, setPage] = useQueryState("page", "1" as string);
  const { user } = useUser();

  useEffect(() => {
    if (id) {
      getHotelById(id).catch((err) =>
        console.error("Error fetching selectedHotel:", err)
      );
      getRoomByHotel(id, parseInt(page), 10);
    }
  }, []);

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
                      src={img}
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

      <div className="w-full md:w-[90%] rounded-xl mt-3 md:rounded-2xl border px-4 md:px-10 border-blue-500 mx-auto mb-10">
        <div className="font-bold text-2xl md:text-4xl pt-5 md:pt-20">
          {selectedHotel.hotelName}
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

        <div className="flex flex-col gap-5 mt-5">
          <div className="flex items-center">
            <MapPin className="text-blue-500 mr-2 w-4 h-4 md:w-5 md:h-5" />
            <div className="text-sm md:text-base">
              Địa chỉ: {selectedHotel.address}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <img
              className="w-7 rounded-full"
              src={
                selectedHotel.user.avatarURL ||
                `${import.meta.env.VITE_AVATAR_API}${
                  selectedHotel.user.fullName
                }`
              }
              alt={selectedHotel.user.fullName}
            />
            <div>
              <div>{selectedHotel.user.email}</div>
              <div>{selectedHotel.user.phoneNumber}</div>
            </div>
          </div>
        </div>

        {selectedHotel.description && (
          <div className="mt-4 md:mt-5">
            <div className="font-semibold text-base md:text-lg">Mô tả</div>
            <div className="mt-1 md:mt-2 text-gray-700 text-sm md:text-base">
              {selectedHotel.description}
            </div>
          </div>
        )}

        <div className="mt-4 md:mt-5 pb-5 md:pb-10">
          <div className="font-semibold text-base md:text-lg mb-2 md:mb-3">
            Phòng
          </div>
          <div>
            {roomList && roomList.map((room) => <div>{room.roomName}</div>)}
          </div>
          <div className="space-y-3"></div>
        </div>
        {(user?.role === "Admin" || user?.role === "Supervisor") && (
          <div className="flex w-110 gap-10 mx-auto mb-7">
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
  );
};
export default HotelInfo;
