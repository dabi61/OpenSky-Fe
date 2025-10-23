import { Button } from "@mui/material";
import { Star } from "lucide-react";
import type { HotelType } from "../types/response/hotel.type";
import { useNavigate } from "react-router-dom";

function HotelItem({ item }: { item: HotelType }) {
  const navigate = useNavigate();
  return (
    <div className="rounded-2xl shadow-lg flex flex-col sm:flex-row w-full md:w-200">
      <div className="sm:w-40 md:w-48 lg:w-56 h-48 sm:h-auto">
        <img
          src={item.firstImage}
          className="w-full h-40 object-cover rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none"
          alt={item.hotelName}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between w-full p-4 sm:p-5">
        <div className="flex-1 mb-4 sm:mb-0 sm:pr-4">
          <h3 className="font-semibold text-lg mb-1">{item.hotelName}</h3>
          <div className="text-gray-600 mb-2 line-clamp-2">
            {item.description}
          </div>
          <div className="flex gap-1 mb-2">
            {Array.from({ length: item.star }).map((_, index) => (
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
          <div className="flex justify-end">
            <Button
              variant="contained"
              size="medium"
              onClick={() => navigate(`/hotel_info/${item.hotelID}`)}
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
