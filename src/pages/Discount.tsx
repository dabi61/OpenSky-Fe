import assets from "../assets";
import VoucherItem from "../components/VoucherItem";
import { vouchers } from "../constants/Voucher.const";
import { motion } from "framer-motion";

const Discount: React.FC = () => {
  return (
    <div>
      <div className="w-full relative">
        <div>
          <img
            className="w-full h-70 object-cover absolute z-10"
            src={assets.discount_background}
          />
          <div className="relative z-20 flex flex-col justify-center w-full h-70 md:items-end md:pr-70">
            <div className="flex flex-col justify-center items-center">
              <div className="font-bold text-4xl">Ưu đãi hấp dẫn</div>
              <div className="font-thin mt-5 text-lg">
                Nhận nhiều phiếu ưu đãi hằng ngày
              </div>
            </div>
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="flex justify-center mx-auto"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 pb-5 mt-10 w-full max-w-screen-xl px-4">
          {vouchers.map((item, index) => (
            <VoucherItem key={index} item={item} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Discount;
