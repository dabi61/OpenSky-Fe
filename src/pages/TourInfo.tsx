import { useEffect, useState, type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTour } from "../contexts/TourContext";
import type { TourType, TourTypeWithImgs } from "../types/response/tour.type";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, MapPin, Star, Users } from "lucide-react";
import OverlayReload from "../components/Loading";
import { Button } from "@mui/material";
import { useUser } from "../contexts/UserContext";
import TourItineraryItem from "../components/TourItineraryItem";
import { useBookingRoom } from "../contexts/BookingRoomContext";
import { useSchedule } from "../contexts/ScheduleContext";
import dayjs from "dayjs";
import Pagination from "../components/Pagination";
import type { ScheduleType } from "../types/response/schedule.type";

const TourInfo: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getTourById,
    loading,
    selectedTour,
    tourItineraryList,
    getTourItineraryByTour,
  } = useTour();
  const { user } = useUser();
  // const { addTourToBookingList } = useBookingRoom();
  const { getScheduleByTour, scheduleList } = useSchedule();
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;
  const [totalPages, setTotalPages] = useState(0);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleType | null>(
    null
  );

  const [emblaRefImgs, emblaApi] = useEmblaCarousel({
    axis: "x",
    align: "center",
    dragFree: true,
    loop: true,
  });

  const fetchTour = async () => {
    try {
      if (id) {
        const tour = await getTourById(id);
        if (tour) {
          await getTourItineraryByTour(id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch tour:", error);
    }
  };

  useEffect(() => {
    const fetchSchedule = async () => {
      if (id) {
        const res = await getScheduleByTour(id, page, itemsPerPage);
        setTotalPages(res.totalPages);
      }
    };
    fetchSchedule();
  }, [id, page]);

  const summaryTour: TourType = {
    tourID: selectedTour?.tourID || "",
    tourName: selectedTour?.tourName || "",
    address: selectedTour?.address || "",
    province: selectedTour?.province || "",
    star: selectedTour?.star || 0,
    price: selectedTour?.price || 0,
    maxPeople: selectedTour?.maxPeople || 1,
    status: selectedTour?.status || "Inactive",
    description: selectedTour?.description || "",
    firstImage: selectedTour?.images?.[0]?.imageUrl || "",
  };

  useEffect(() => {
    fetchTour();
  }, []);

  useEffect(() => {
    fetchTour();
  }, []);

  useEffect(() => {
    if (selectedTour?.images?.length && emblaApi) {
      emblaApi.reInit();
    }
  }, [selectedTour?.images, emblaApi]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  if (loading || !selectedTour) {
    return <OverlayReload />;
  }

  const tour: TourTypeWithImgs = selectedTour;

  return (
    <div className="relative w-full md:w-[90%] mx-auto">
      <div className="relative my-5">
        {tour.images && tour.images.length > 0 && (
          <div className="embla overflow-hidden" ref={emblaRefImgs}>
            <div className="embla__container flex w-full">
              {tour.images.map((img, index) => (
                <div
                  key={index}
                  className="embla__slide basis-full shrink-0 mx-auto flex justify-center items-center w-auto h-100"
                >
                  <img
                    src={img.imageUrl}
                    alt={`tour-img-${index}`}
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

      <div className="w-full md:w-[90%] rounded-xl md:rounded-2xl border px-4 md:px-10 border-blue-500 mx-auto mb-10">
        <div className="font-bold text-2xl md:text-4xl pt-5 md:pt-20">
          {tour.tourName}
        </div>

        <div className="flex gap-1 mt-3 md:mt-5 w-full">
          {Array.from({ length: tour.star }).map((_, index) => (
            <Star
              key={index}
              className="text-yellow-300"
              fill="currentColor"
              size={24}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mt-3 md:mt-5">
          <div className="flex items-center">
            <MapPin className="text-blue-500 mr-2 w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm md:text-base">
              Nơi xuất phát: {tour.address}
            </span>
          </div>

          <div className="flex items-center">
            <Users className="text-blue-500 mr-2 w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm md:text-base">
              Số chỗ: {tour.maxPeople}
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between mt-4 md:mt-5 items-center gap-3 md:gap-4">
          <div className="font-bold text-blue-500 text-xl md:text-3xl">
            {new Intl.NumberFormat("vi-VN").format(tour.price)} VNĐ
          </div>
          {user?.role === "Customer" && (
            <Button
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: "#3B82F6",
                "&:hover": {
                  backgroundColor: "#2563EB",
                },
                padding: "12px 30px",
                borderRadius: "1rem",
                width: { xs: "100%", md: "auto" },
              }}
            >
              <div className="font-semibold text-base md:text-lg">Đặt vé</div>
            </Button>
          )}
        </div>

        {tour.description && (
          <div className="mt-4 md:mt-5">
            <div className="font-semibold text-base md:text-lg">Mô tả</div>
            <div className="mt-1 md:mt-2 text-gray-700 text-sm md:text-base">
              {tour.description}
            </div>
          </div>
        )}

        <div className="mt-4 md:mt-5 pb-5 md:pb-10">
          <div className="font-semibold text-base md:text-lg mb-2 md:mb-3">
            Lịch trình
          </div>
          <div className="space-y-3 relative border-l-3 border-blue-400 pl-6">
            {tourItineraryList.map((itinerary) => (
              <TourItineraryItem
                key={itinerary.itineraryID}
                itinerary={itinerary}
                size="compact"
              />
            ))}
          </div>
        </div>

        <div className="mt-4 md:mt-5 pb-5 md:pb-10">
          <div className="font-semibold text-base md:text-lg mb-4 md:mb-6">
            Lịch trình khởi hành
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {scheduleList.length > 0 ? (
              scheduleList.map((schedule) => (
                <div
                  key={schedule.scheduleID}
                  className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 bg-white hover:border-blue-300 min-h-[180px] cursor-pointer flex flex-col justify-between"
                  onClick={() => setSelectedSchedule(schedule)}
                >
                  <div className="flex-1">
                    <div className="text-center mb-4 flex flex-col gap-1">
                      <div className="font-bold text-lg text-blue-600 mb-1">
                        {dayjs(schedule.startTime).format("DD/MM")}
                      </div>
                      <div className=" text-xs md:text-sm text-gray-600 text-center ">
                        {dayjs(schedule.startTime).format("DD/MM/YYYY")} -
                        {dayjs(schedule.endTime).format("DD/MM/YYYY")}
                      </div>
                      <div className="text-xs text-gray-500">
                        Thời gian khởi hành:
                        <span className="ml-1">
                          {dayjs(schedule.startTime).format("HH:mm")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-evenly items-center pt-3 border-t border-gray-100">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Users size={14} />
                        <span>Đã đặt</span>
                      </div>
                      <div className="font-bold text-blue-600 text-sm">
                        {schedule.numberPeople}
                      </div>
                    </div>

                    {schedule.remainingSlots !== null && (
                      <div className="text-center">
                        <div className="text-xs text-gray-600">Chỗ trống</div>
                        <div
                          className={`font-bold text-sm ${
                            schedule.remainingSlots > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {schedule.remainingSlots}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl">
                <Users size={48} className="mx-auto mb-3 text-gray-400" />
                <div className="text-lg">
                  Chưa có lịch trình nào cho tour này
                </div>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <Pagination
              onChange={setPage}
              page={page}
              totalPages={totalPages}
            />
          )}
        </div>

        {(user?.role === "Customer" || user?.role === "Hotel") && (
          <div className="flex justify-center md:w-100 items-center mx-auto mb-7">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#3B82F6",
                padding: "12px 24px",
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "16px",
                textTransform: "none",
                flex: 1,
                "&:hover": {
                  backgroundColor: "#2563EB",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                },
                transition: "all 0.2s ease-in-out",
              }}
              onClick={() => {
                navigate("/booking");
                // addTourToBookingList(summaryTour);
              }}
            >
              Đặt tour ngay
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourInfo;
