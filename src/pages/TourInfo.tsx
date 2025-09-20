import { useEffect, type FC } from "react";
import { useParams } from "react-router-dom";
import { useTour } from "../contexts/TourContext";
import type { TourTypeWithImgs } from "../types/response/tour.type";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, MapPin, Star, Users } from "lucide-react";
import OverlayReload from "../components/Loading";
import { Button } from "@mui/material";
import { useUser } from "../contexts/UserContext";

const TourInfo: FC = () => {
  const { id } = useParams();
  const { getTourById, loading, selectedTour } = useTour();
  const { user } = useUser();

  const [emblaRefImgs, emblaApi] = useEmblaCarousel({
    axis: "x",
    align: "center",
    dragFree: true,
    loop: true,
  });

  useEffect(() => {
    if (id) {
      getTourById(id).catch((err) =>
        console.error("Error fetching tour:", err)
      );
    }
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

  console.log(tour);

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
                    src={img}
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

      {/* Thông tin tour */}
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
          <div className="space-y-3"></div>
        </div>
      </div>
    </div>
  );
};

export default TourInfo;
