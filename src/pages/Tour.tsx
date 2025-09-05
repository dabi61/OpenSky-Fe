import React, { useState } from "react";
import { Calendar, Search, MapPin, Star } from "lucide-react";
import tours from "../constants/TourItem.const";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { motion } from "framer-motion";

interface Tour {
  img: string;
  name: string;
  description: string;
  price: number;
  rating: number;
}

const Tour: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  const filteredTours = tours.filter((tour: Tour) => {
    const matchesSearch =
      tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.description.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesPrice = true;
    if (priceFilter === "low") {
      matchesPrice = tour.price < 2000000;
    } else if (priceFilter === "medium") {
      matchesPrice = tour.price >= 2000000 && tour.price < 4000000;
    } else if (priceFilter === "high") {
      matchesPrice = tour.price >= 4000000;
    }

    return matchesSearch && matchesPrice;
  });

  const totalPages = Math.ceil(filteredTours.length / itemsPerPage);
  const paginatedTours = filteredTours.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (value: number) => {
    setCurrentPage(value);
    window.scrollTo(0, 0);
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={16}
        className={
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }
      />
    ));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
          Khám phá Tour Du lịch
        </h1>
        <p className="text-gray-600 text-lg">
          Trải nghiệm những điểm đến tuyệt vời nhất Việt Nam
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm tour hoặc điểm đến..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-0"
          />
        </div>

        <FormControl>
          <InputLabel>Mức giá</InputLabel>
          <Select
            value={priceFilter}
            label="Mức giá"
            onChange={(e) => {
              setPriceFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <MenuItem value="all">Tất cả mức giá</MenuItem>
            <MenuItem value="low">Dưới 2 triệu</MenuItem>
            <MenuItem value="medium">2 - 4 triệu</MenuItem>
            <MenuItem value="high">Trên 4 triệu</MenuItem>
          </Select>
        </FormControl>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
      >
        {paginatedTours.map((tour: Tour, index: number) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 flex flex-col h-full"
          >
            <img
              src={tour.img}
              alt={tour.name}
              className="w-full h-48 object-cover"
            />

            <div className="p-5 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 h-15">
                  {tour.description}
                </h3>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ml-2">
                  {new Intl.NumberFormat("vi-VN").format(tour.price)} VND
                </span>
              </div>

              <div className="flex items-center mb-4">
                <div className="flex mr-2">{renderStars(tour.rating)}</div>
                <span className="text-sm text-gray-600">{tour.rating}/5</span>
              </div>

              <div className="flex items-center mt-auto">
                <MapPin size={16} className="text-gray-500 mr-1" />
                <span className="text-sm text-gray-600">{tour.name}</span>
              </div>
            </div>

            <div className="px-5 pb-5">
              <Button
                variant="contained"
                fullWidth
                startIcon={<Calendar size={18} />}
                sx={{
                  backgroundColor: "#3B82F6",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  fontWeight: 500,
                  fontSize: "16px",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#2563EB",
                  },
                }}
              >
                Đặt tour ngay
              </Button>
            </div>
          </div>
        ))}
      </motion.div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredTours.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-2">
            Không tìm thấy tour nào phù hợp
          </p>
          <p className="text-gray-500">
            Hãy thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc
          </p>
        </div>
      )}
    </div>
  );
};

export default Tour;
