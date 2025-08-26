import { Button } from "@mui/material";
import { Hotel, TentTree } from "lucide-react";

export const VoucherEnum = {
  TOUR: "tour",
  HOTEL: "hotel",
} as const;

type VoucherType = {
  description: string;
  type: (typeof VoucherEnum)[keyof typeof VoucherEnum];
  percent: string;
  code: string;
};

type VoucherItemProps = {
  item: VoucherType;
};

function VoucherItem({ item }: VoucherItemProps) {
  return (
    <div
      className="flex flex-col cursor-pointer p-5 md:w-102 w-81
      hover:shadow-lg rounded-2xl flex-shrink-0 shadow-lg transition-transform duration-300 hover:scale-105"
    >
      <div className="flex gap-5">
        <div>
          {item.type === VoucherEnum.HOTEL ? (
            <Hotel size={60} className="text-blue-500" />
          ) : (
            <TentTree size={60} className="text-green-500" />
          )}
        </div>
        <div>
          <div className="md:text-lg text-[15px] font-semibold flex w-full">
            {item.description}
          </div>
          <div className="md:text-lg text-[15px] flex w-full">
            Giảm {item.percent}
          </div>
        </div>
      </div>
      <div className="flex gap-3 mt-5 w-full ">
        <div className="p-2 text-sm bg-gray-200 rounded-xl flex-1 text-gray-700">
          {item.code}
        </div>
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
        >
          Lưu
        </Button>
      </div>
    </div>
  );
}

export default VoucherItem;
