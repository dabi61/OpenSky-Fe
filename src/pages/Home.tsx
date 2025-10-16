import assets from "../assets";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import HomeDescriptionItem from "../components/HomeDescriptionItem";
import { homeDescriptions } from "../constants/HomeDescription";
import { useEffect } from "react";
import HotelHomeItem from "../components/HotelHomeItem";
import TourHomeItem from "../components/TourHomeItem";
import VoucherHomeItem from "../components/VoucherHomeItem";
import { useNavigate } from "react-router-dom";
import { useTour } from "../contexts/TourContext";
import { useHotel } from "../contexts/HotelContext";
import { useVoucher } from "../contexts/VoucherContext";
import { useUser } from "../contexts/UserContext";
import { handleSaveVouchers } from "../api/userVoucher.api";
import { toast } from "sonner";

const Home: React.FC = () => {
  const [emblaRefVoucher] = useEmblaCarousel({ axis: "x", dragFree: true });
  const [emblaRefTour] = useEmblaCarousel({ axis: "x", dragFree: true });
  const [emblaRefHotel] = useEmblaCarousel({ axis: "x", dragFree: true });
  const { tourList, getAllTours } = useTour();
  const { hotelList, getActiveHotel } = useHotel();
  const { voucherList, getUnsavedVoucher, getAvailableVoucher } = useVoucher();
  const { user } = useUser();

  const fetchTours = async () => {
    try {
      const initialData = await getAllTours(1, 20);
      const total = initialData.totalPages;
      const randomPage = Math.floor(Math.random() * total) + 1;
      await getAllTours(randomPage, 20);
    } catch (error) {
      console.error("Failed to fetch random tours:", error);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchHotels = async () => {
    try {
      const initialData = await getActiveHotel(1, 20);
      const total = initialData.totalPages;
      const randomPage = Math.floor(Math.random() * total) + 1;
      await getActiveHotel(randomPage, 20);
    } catch (error) {
      console.error("Failed to fetch random tours:", error);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchVouchers = async () => {
    try {
      if (user) {
        const initialData = await getUnsavedVoucher(1, 20);
        const totalPages = initialData.totalPages;
        const randomPage = Math.floor(Math.random() * totalPages) + 1;
        await getUnsavedVoucher(randomPage, 20);
      } else {
        const initialData = await getAvailableVoucher(1, 20);
        const totalPages = initialData.totalPages;
        const randomPage = Math.floor(Math.random() * totalPages) + 1;
        await getAvailableVoucher(randomPage, 20);
      }
    } catch (error) {
      console.error("Failed to fetch vouchers:", error);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, [user]);

  const navigate = useNavigate();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (id: string) => {
    const res = await handleSaveVouchers(id);
    if (res.userVoucherId) {
      toast.success(res.message);
      fetchVouchers();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className=" bg-cover bg-center overflow-x-hidden">
      <div
        className="w-screen md:h-[calc(100vh-5rem)] h-[calc(100vh-3.8rem)]  flex flex-col justify-center items-center mx-auto my-auto"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 128, 255, 0.2), rgba(0, 128, 255, 0.2)), url(${assets.home_background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-white flex flex-col items-center gap-5 w-full"
        >
          <div className="text-white flex flex-col items-center gap-5">
            <div className="md:text-7xl text-5xl font-bold my-10">OPENSKY</div>
            <div className="md:text-3xl text-xl font-bold">
              Khám phá thế giới cùng OpenSky
            </div>
            <div className="md:text-xl font-bold flex text-center ">
              Đặt phòng khách sạn, tour du lịch trong nước & quốc tế nhanh chóng
              - giá tốt mỗi ngày.
            </div>
          </div>
        </motion.div>
      </div>
      <div>
        <div className="p-10 flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="flex justify-between w-full mt-5">
              <div className="font-bold md:text-xl">Tour du lịch phổ biến</div>
              <div
                onClick={() => navigate("/hotel")}
                className="text-blue-400 underline text-sm flex items-center cursor-pointer hover:font-semibold hover:text-blue-500"
              >
                Xem thêm
              </div>
            </div>
            <div
              className="flex overflow-x-hidden scrollbar-hide mt-5 "
              ref={emblaRefTour}
            >
              <div className="flex scrollbar-hide gap-5 pb-5">
                {tourList.map((item, index) => {
                  return <TourHomeItem item={item} key={index} />;
                })}
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="flex justify-between w-full">
              <div className="font-bold md:text-xl">Ưu đãi</div>
              <div
                onClick={() => navigate("/discount")}
                className="text-blue-400 underline text-sm flex items-center cursor-pointer hover:font-semibold hover:text-blue-500"
              >
                Xem thêm
              </div>
            </div>
            <div
              className="overflow-x-hidden scrollbar-hide mt-5"
              ref={emblaRefVoucher}
            >
              <div className="flex scrollbar-hide gap-5 pb-5">
                {voucherList.map((item) => {
                  return (
                    <VoucherHomeItem
                      key={item.voucherID}
                      item={item}
                      onSuccess={() => handleSubmit(item.voucherID)}
                    />
                  );
                })}
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="flex justify-between w-full mt-5">
              <div className="font-bold md:text-xl">
                Địa điểm khách sạn nổi tiếng
              </div>
              <div className="text-blue-400 underline text-sm flex items-center cursor-pointer hover:font-semibold hover:text-blue-500">
                Xem thêm
              </div>
            </div>
            <div
              className="flex overflow-x-hidden scrollbar-hide mt-5 "
              ref={emblaRefHotel}
            >
              <div className="flex scrollbar-hide gap-5 pb-5">
                {hotelList.map((item, index) => {
                  return <HotelHomeItem item={item} key={index} />;
                })}
              </div>
            </div>
          </motion.div>
          <div>
            <div className="font-bold md:text-xl mt-5">
              Tại sao bạn bên chọn OpenSky
            </div>
            <div className="w-full flex gap-5">
              {homeDescriptions.map((item, index) => (
                <HomeDescriptionItem item={item} key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
