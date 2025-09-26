import React, { useEffect, useState } from "react";
import { Calendar, Search, MapPin, Star, Filter, User } from "lucide-react";
import { Button, FormControl, MenuItem, Select } from "@mui/material";
import { motion } from "framer-motion";
import { useTour } from "../contexts/TourContext";
import useQueryState from "../hooks/useQueryState";
import OverlayReload from "../components/Loading";
import Sticky from "react-stickynode";
import { getProvinces } from "../api/province.api";
import type { Province } from "../types/api/province";
import StarSort from "../components/StarSort";
import { useNavigate } from "react-router-dom";

const Tour: React.FC = () => {
  const { tourList, getAllTours } = useTour();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [totalPages, setTotalPages] = useState(0);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [page, setPage] = useQueryState("page", "1" as string);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProvinces() {
      const data = await getProvinces();
      setProvinces(data);
    }
    fetchProvinces();

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const fetchTours = async () => {
    try {
      const currentPage = parseInt(page);
      const data = await getAllTours(currentPage, 20);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch tourList:", error);
    }
  };

  useEffect(() => {
    fetchTours();
  }, [page]);

  if (!tourList) {
    return <OverlayReload />;
  }

  const handlePageChange = (value: number) => {
    setCurrentPage(value);
    setPage(value.toString());
    window.scrollTo(0, 0);
  };

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 200,
      },
    },
  };

  return (
    <div className="container mx-auto py-8 md:px-22">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
          Khám phá Tour Du lịch
        </h1>
        <p className="text-gray-600 text-lg">
          Trải nghiệm những điểm đến tuyệt vời nhất Việt Nam
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="relative w-275 ">
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
      </div>

      <div className="flex flex-col lg:flex-row justify-center items-start gap-4 lg:gap-6">
        <div className="w-full lg:w-[280px] shrink-0 relative">
          {isMobile ? (
            <details className="bg-white rounded-lg shadow-lg mb-4">
              <summary className="p-4 font-bold cursor-pointer flex justify-between items-center">
                Bộ lọc
                <Filter size={20} />
              </summary>
              <div className="p-4 border-t space-y-4">
                <div>
                  <div className="font-bold mb-2">Chọn tỉnh thành</div>
                  <FormControl fullWidth variant="outlined" size="small">
                    <Select
                      labelId="province-label"
                      value={selectedProvince}
                      onChange={(e) =>
                        setSelectedProvince(e.target.value as string)
                      }
                      MenuProps={MenuProps}
                    >
                      <MenuItem value="">
                        <em>-- Chọn tỉnh --</em>
                      </MenuItem>
                      {provinces.map((p) => (
                        <MenuItem key={p.province_id} value={p.province_name}>
                          {p.province_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div className="mt-4 ">
                  <StarSort />
                </div>
              </div>
            </details>
          ) : (
            <Sticky top={80} innerZ={40} bottomBoundary=".main-content">
              <div className="bg-white rounded-lg p-4 shadow-lg space-y-4">
                <div>
                  <div className="font-bold mb-2">Chọn tỉnh thành</div>
                  <FormControl fullWidth variant="outlined" size="small">
                    <Select
                      labelId="province-label"
                      value={selectedProvince}
                      onChange={(e) =>
                        setSelectedProvince(e.target.value as string)
                      }
                      MenuProps={MenuProps}
                    >
                      <MenuItem value="">
                        <em>-- Chọn tỉnh --</em>
                      </MenuItem>
                      {provinces.map((p) => (
                        <MenuItem key={p.province_id} value={p.province_name}>
                          {p.province_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div className="mt-4">
                  <StarSort />
                </div>
              </div>
            </Sticky>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col gap-6 main-content w-full"
        >
          {tourList.length > 0 ? (
            tourList.map((tour) => (
              <motion.div
                key={tour.tourID}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col lg:flex-row h-full group border border-gray-100"
              >
                <div className="lg:w-80 lg:shrink-0 relative overflow-hidden">
                  <img
                    src={tour.firstImage}
                    alt={tour.tourName}
                    className="w-full h-48 lg:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {tour.star > 0 && (
                    <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                      <Star /> {tour.star}/5
                    </div>
                  )}
                </div>

                <div className="flex-1 p-6 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2 pr-4">
                      {tour.tourName}
                    </h3>
                    <span className="text-2xl font-bold text-blue-600 whitespace-nowrap">
                      {new Intl.NumberFormat("vi-VN").format(tour.price)} ₫
                    </span>
                  </div>

                  <div className="flex items-center mb-4">
                    <MapPin size={18} className="text-blue-600 mr-2" />
                    <span className="text-gray-700 font-medium">
                      {tour.province}
                    </span>
                  </div>

                  <p className="text-gray-600 line-clamp-3 mb-6 flex-1">
                    {tour.description ||
                      "Tour du lịch đặc sắc với nhiều trải nghiệm thú vị và đáng nhớ..."}
                  </p>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center text-sm text-gray-500">
                      <User size={16} className="mr-1 text-purple-600" />
                      <span>{tour.maxPeople || 20} người</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <Button
                      variant="contained"
                      startIcon={<Calendar size={18} />}
                      sx={{
                        backgroundColor: "#3B82F6",
                        padding: "12px 24px",
                        borderRadius: "12px",
                        fontWeight: 600,
                        fontSize: "16px",
                        textTransform: "none",
                        flex: 1,
                        "&:hover": {
                          backgroundColor: "#2563EB",
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                        },
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      Đặt tour ngay
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/tour_info/${tour.tourID}`)}
                      sx={{
                        borderColor: "#3B82F6",
                        color: "#3B82F6",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        fontWeight: 500,
                        textTransform: "none",
                        "&:hover": {
                          borderColor: "#2563EB",
                          backgroundColor: "rgba(37, 99, 235, 0.04)",
                          transform: "translateY(-1px)",
                        },
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      Chi tiết
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-white rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Không tìm thấy tour nào phù hợp
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác để khám
                phá thêm nhiều tour hấp dẫn
              </p>
            </div>
          )}
        </motion.div>
      </div>

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
    </div>
  );
};

export default Tour;
