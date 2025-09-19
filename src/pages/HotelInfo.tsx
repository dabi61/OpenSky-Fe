import useEmblaCarousel from "embla-carousel-react";
import { useParams } from "react-router-dom";
import { useHotel } from "../contexts/HotelContext";
import { useEffect } from "react";
import OverlayReload from "../components/Loading";

const HotelInfo = () => {
  const { id } = useParams();

  const { getHotelById, loading, selectedHotel } = useHotel();

  const [emblaRefImgs, emblaApi] = useEmblaCarousel({
    axis: "x",
    align: "center",
    dragFree: true,
    loop: true,
  });

  useEffect(() => {
    if (id) {
      getHotelById(id).catch((err) =>
        console.error("Error fetching tour:", err)
      );
    }
  });

  useEffect(() => {
    if (selectedHotel?.images?.length && emblaApi) {
      emblaApi.reInit();
    }
  }, [selectedHotel?.images, emblaApi]);

  if (loading || !selectedHotel) {
    return <OverlayReload />;
  }

  return <div>Hotel Page</div>;
};
export default HotelInfo;
