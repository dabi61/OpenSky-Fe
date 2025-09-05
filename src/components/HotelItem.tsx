import { Button } from "@mui/material";
import { Star } from "lucide-react";

type Hotel = {
  name: string;
  img: string;
  description: string;
  stars: number;
  price: number;
  address: string;
};

type Props = {
  item: Hotel;
};

function HotelItem({ item }: Props) {
  return (
    <div className="rounded-2xl shadow-lg flex flex-col sm:flex-row w-full md:w-200">
      <div className="sm:w-40 md:w-48 lg:w-56 h-48 sm:h-auto">
        <img
          src={item.img}
          className="w-full h-full object-cover rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none"
          alt={item.name}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between w-full p-4 sm:p-5">
        <div className="flex-1 mb-4 sm:mb-0 sm:pr-4">
          <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
          <div className="text-gray-600 mb-2 line-clamp-2">
            {item.description}
          </div>
          <div className="flex gap-1 mb-2">
            {Array.from({ length: item.stars }).map((_, index) => (
              <Star
                key={index}
                className="w-4 h-4 text-yellow-300"
                fill="currentColor"
              />
            ))}
          </div>
          <div className="text-sm text-gray-500">{item.address}</div>
        </div>

        <div className="flex flex-col justify-between border-t pt-4 sm:pt-0 sm:border-t-0 sm:pl-4 ">
          <div className="flex flex-col items-end mb-4 sm:mb-0">
            <div className="text-sm text-gray-600">Giá mỗi đêm:</div>
            <div className="font-semibold text-blue-500 text-lg md:text-xl">
              {new Intl.NumberFormat("vi-VN").format(item.price)} VND
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              variant="contained"
              size="medium"
              sx={{
                backgroundColor: "#3B82F6",
                borderRadius: "10px",
                "&:hover": {
                  backgroundColor: "#2563EB",
                },
                width: { xs: "100%", sm: "9rem" },
              }}
            >
              Xem
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotelItem;
