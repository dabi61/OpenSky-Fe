import { InputAdornment, TextField } from "@mui/material";
import assets from "../assets";
import { Search } from "lucide-react";
import { locaions } from "../constants/LocationHomeItem.const";
import { vouchers } from "../constants/Voucher.const";
import LocationHomeItem from "../components/LocationHomeItem";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import VoucherItem from "../components/Voucher";
import TourItem from "../components/TourItem";
import tours from "../constants/TourItem.const";
import hotels from "../constants/HotelItem.const";
import HotelItem from "../components/HotelItem";
import HomeDescriptionItem from "../components/HomeDescriptionItem";
import { homeDescriptions } from "../constants/HomeDescription";
import { useEffect } from "react";

function Home() {
  const [emblaRefLocal] = useEmblaCarousel({ axis: "x", dragFree: true });
  const [emblaRefForeign] = useEmblaCarousel({ axis: "x", dragFree: true });
  const [emblaRefVoucher] = useEmblaCarousel({ axis: "x", dragFree: true });
  const [emblaRefTour] = useEmblaCarousel({ axis: "x", dragFree: true });
  const [emblaRefHotel] = useEmblaCarousel({ axis: "x", dragFree: true });

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

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
          <TextField
            variant="outlined"
            placeholder="Nhập điểm du lịch hoặc tên khách sạn"
            className="bg-white rounded-2xl md:w-3/5 w-4/5 flex flex-col"
            size="medium"
            sx={{
              backgroundColor: "white",
              borderRadius: "1rem",
              paddingX: "0.5rem",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  border: "none",
                },
                "&:hover fieldset": {
                  border: "none",
                },
                "&.Mui-focused fieldset": {
                  border: "none",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search className="w-5" />
                </InputAdornment>
              ),
            }}
          />
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
            <div className="flex justify-between w-full">
              <div className="font-bold md:text-xl">
                Các địa điểm thu hút trong nước
              </div>
              <div className="text-blue-400 underline text-sm flex items-center cursor-pointer hover:font-semibold hover:text-blue-500">
                Xem thêm
              </div>
            </div>
            <div
              className="flex overflow-x-hidden scrollbar-hide mt-5 "
              ref={emblaRefLocal}
            >
              <div className="flex scrollbar-hide gap-5 pb-5">
                {locaions.map((item, index) => {
                  return (
                    <LocationHomeItem
                      key={index}
                      img={item.img}
                      name={item.name}
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
            <div className="flex justify-between w-full">
              Các địa điểm hot ở nước ngoài
              <div className="text-blue-400 underline text-sm flex items-center cursor-pointer hover:font-semibold hover:text-blue-500">
                Xem thêm
              </div>
            </div>
            <div
              className="flex overflow-x-hidden scrollbar-hide mt-5"
              ref={emblaRefForeign}
            >
              <div className="flex scrollbar-hide gap-5 pb-5">
                {locaions.map((item, index) => {
                  return (
                    <LocationHomeItem
                      key={index}
                      img={item.img}
                      name={item.name}
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
            <div className="flex justify-between w-full">
              <div className="font-bold md:text-xl">Ưu đãi</div>
              <div className="text-blue-400 underline text-sm flex items-center cursor-pointer hover:font-semibold hover:text-blue-500">
                Xem thêm
              </div>
            </div>
            <div
              className="overflow-x-hidden scrollbar-hide mt-5"
              ref={emblaRefVoucher}
            >
              <div className="flex scrollbar-hide gap-5 pb-5">
                {vouchers.map((item, index) => {
                  return <VoucherItem key={index} item={item} />;
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
              <div className="font-bold md:text-xl">Tour du lịch phổ biến</div>
              <div className="text-blue-400 underline text-sm flex items-center cursor-pointer hover:font-semibold hover:text-blue-500">
                Xem thêm
              </div>
            </div>
            <div
              className="flex overflow-x-hidden scrollbar-hide mt-5 "
              ref={emblaRefTour}
            >
              <div className="flex scrollbar-hide gap-5 pb-5">
                {tours.map((item, index) => {
                  return <TourItem item={item} key={index} />;
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
                Địa điểm khách sạn nổi tiêng
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
                {hotels.map((item, index) => {
                  return <HotelItem item={item} key={index} />;
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
}

export default Home;
