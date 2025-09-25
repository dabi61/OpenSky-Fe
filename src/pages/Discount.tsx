import assets from "../assets";
import VoucherItem from "../components/VoucherItem";
import { motion } from "framer-motion";
import { useVoucher } from "../contexts/VoucherContext";
import { useEffect, useState } from "react";
import useQueryState from "../hooks/useQueryState";
import OverlayReload from "../components/Loading";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Discount: React.FC = () => {
  const { getAvailableVoucher, voucherList, loading } = useVoucher();
  const [page, setPage] = useQueryState("page", "1" as string);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const data = await getAvailableVoucher(Number(page), 20);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Failed to fetch tourList:", error);
      }
    };
    fetchVouchers();
  }, []);

  if (loading) {
    return <OverlayReload />;
  }

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
          {voucherList.map((item, index) => (
            <VoucherItem key={index} item={item} />
          ))}
        </div>
      </motion.div>
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

export default Discount;
