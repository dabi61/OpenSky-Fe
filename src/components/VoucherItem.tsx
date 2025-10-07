import { Button } from "@mui/material";
import { Hotel, TentTree } from "lucide-react";
import type { FC } from "react";
import type { VoucherType } from "../types/response/voucher.type";
import dayjs from "dayjs";
import { useUser } from "../contexts/UserContext";

type VoucherItemProps = {
  item: VoucherType;
  onSuccess: () => void;
};

const VoucherItem: FC<VoucherItemProps> = ({ item, onSuccess }) => {
  const { user } = useUser();

  return (
    <div
      className="
        flex flex-col cursor-pointer p-4 sm:p-5 md:p-6
        w-full sm:w-72 md:w-60
        border border-blue-500 rounded-2xl 
        flex-shrink-0 transition-transform duration-300 hover:scale-105
      "
    >
      <div className="flex flex-col gap-5 justify-center items-center">
        <div>
          {item.tableType === "Hotel" ? (
            <Hotel className="text-blue-500" size={55} />
          ) : (
            <TentTree className="text-green-500" size={55} />
          )}
        </div>

        <div className="flex flex-col gap-2 w-full text-center md:text-left">
          <div className="text-sm sm:text-base md:text-lg font-semibold">
            Giảm tới {item.percent}% cho bill{" "}
            {item.tableType === "Hotel" ? "Khách sạn" : "Tour"}
          </div>
          <div className="text-[13px] sm:text-sm md:text-[15px] text-gray-700">
            {item.description}
          </div>

          <div className="text-[11px] sm:text-[12px] md:text-[12px] flex flex-col md:block text-gray-600 whitespace-nowrap">
            <div>Hiệu lực: </div>
            <div className="flex mt-1 flex-col md:flex-row">
              <span>{dayjs(item.startDate).format("DD/MM/YYYY")}</span>
              <span className="hidden md:block"> - </span>
              <span>{dayjs(item.endDate).format("DD/MM/YYYY")}</span>
            </div>
          </div>

          <div
            className={`text-sm sm:text-base font-medium ${
              item.isAvailable ? "text-green-600" : "text-red-600"
            }`}
          >
            {item.isAvailable ? "Đang khả dụng" : "Hết hạn / Không khả dụng"}
          </div>
        </div>
      </div>

      {user?.role === "Customer" && (
        <Button
          variant="contained"
          type="button"
          sx={{
            backgroundColor: "#3B82F6",
            borderRadius: "12px",
            width: "100%",
            mt: 4,
            "&:hover": {
              backgroundColor: "#2563EB",
            },
          }}
          onClick={onSuccess}
        >
          Lưu
        </Button>
      )}
    </div>
  );
};

export default VoucherItem;
