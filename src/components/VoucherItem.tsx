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
      className="flex flex-col cursor-pointer p-4 md:w-60 w-50
      border border-blue-500 rounded-2xl flex-shrink-0 transition-transform duration-300 hover:scale-105"
    >
      <div className="flex flex-col gap-5 justify-center items-center">
        <div>
          {item.tableType === "Hotel" ? (
            <Hotel size={65} className="text-blue-500" />
          ) : (
            <TentTree size={65} className="text-green-500" />
          )}
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="md:text-lg font-semibold">
            Giảm tới {item.percent}% cho bill{" "}
            {item.tableType === "Hotel" ? "Khách sạn" : "Tour"}
          </div>
          <div className="md:text-sm text-[15px]">{item.description}</div>

          <div className="text-[12px] text-gray-600 whitespace-nowrap">
            Hiệu lực: {dayjs(item.startDate).format("DD/MM/YYYY")} -
            {dayjs(item.endDate).format("DD/MM/YYYY")}
          </div>

          <div
            className={`text-sm font-medium ${
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
          type="submit"
          sx={{
            backgroundColor: "#3B82F6",
            borderRadius: "12px",
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
