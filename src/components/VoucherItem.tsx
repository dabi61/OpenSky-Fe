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
      className="flex flex-col cursor-pointer p-5 md:w-60 w-50
      border border-blue-500 rounded-2xl flex-shrink-0 transition-transform duration-300 hover:scale-105"
    >
      <div className="flex flex-col gap-5 justify-center items-center">
        <div>
          {item.type === VoucherEnum.HOTEL ? (
            <Hotel size={65} className="text-blue-500" />
          ) : (
            <TentTree size={65} className="text-green-500" />
          )}
        </div>
        <div>
          <div className="md:text-lg font-semibold flex w-full">
            Giảm tới {item.percent} cho bill{" "}
            {item.type === VoucherEnum.HOTEL ? "Khách sạn" : "Tour"}
          </div>
          <div className="md:text-sm text-[15px] flex w-full">
            {item.description}
          </div>
        </div>
      </div>
      <div className="flex gap-3 mt-5 w-full flex-col">
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
