import Sticky from "react-stickynode";
import StarSort from "../components/StarSort";
import HotelItem from "../components/HotelItem";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getProvinces } from "../api/province.api";
import type { Province } from "../types/api/province";
import {
  Button,
  FormControl,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import { Search } from "lucide-react";
import assets from "../assets";
import { useNavigate } from "react-router-dom";
import { useHotel } from "../contexts/HotelContext";
import useQueryState from "../hooks/useQueryState";
import OverlayReload from "../components/Loading";
import { useUser } from "../contexts/UserContext";

const Hotel: React.FC = () => {
  const { user } = useUser();
  const { getAllHotelExceptRemoved, hotelList } = useHotel();
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedProvince, setSelectedProvince] = useState<number | "">("");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const [page, setPage] = useQueryState("page", "1" as string);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchHotels = async () => {
    try {
      const currentPage = parseInt(page);
      const data = await getAllHotelExceptRemoved(currentPage, 20);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch tourList:", error);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [page]);

  if (!hotelList) {
    return <OverlayReload />;
  }

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

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 200,
      },
    },
  };

  const handlePriceFilterChange = (event: SelectChangeEvent<string>) => {
    setPriceFilter(event.target.value);
  };

  const handlePageChange = (value: number) => {
    setCurrentPage(value);
    setPage(value.toString());
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div className="text-center mb-10">
        <h1 className="text-3xl mt-10 md:text-4xl font-bold text-blue-600 mb-4">
          Lựa chọn khách sạn bạn mong muốn
        </h1>
        <p className="text-gray-600 text-lg">
          Trải nghiệm những khách sạn bậc nhất Việt Nam
        </p>
      </div>

      <div className="flex justify-center">
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

      <div className="flex flex-col lg:flex-row justify-center items-start mt-5 gap-4 lg:gap-6 px-4 lg:px-0 md:mx-auto">
        <div className="w-full lg:w-[280px] shrink-0 relative">
          {isMobile ? (
            <details className="bg-white rounded-lg shadow-lg mb-4">
              <summary className="p-4 font-bold cursor-pointer flex justify-between items-center">
                Bộ lọc
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </summary>
              <div className="p-4 border-t space-y-4">
                <div>
                  <div className="font-bold mb-2">Chọn tỉnh thành</div>
                  <FormControl fullWidth variant="outlined" size="small">
                    <Select
                      labelId="province-label"
                      value={selectedProvince}
                      onChange={(e) =>
                        setSelectedProvince(e.target.value as number)
                      }
                      MenuProps={MenuProps}
                    >
                      <MenuItem value="">
                        <em>-- Chọn tỉnh --</em>
                      </MenuItem>
                      {provinces.map((p) => (
                        <MenuItem key={p.province_id} value={p.province_id}>
                          {p.province_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div>
                  <div className="font-bold mb-2">Mức giá</div>
                  <FormControl fullWidth variant="outlined" size="small">
                    <Select
                      value={priceFilter}
                      onChange={handlePriceFilterChange}
                    >
                      <MenuItem value="all">Tất cả mức giá</MenuItem>
                      <MenuItem value="low">Dưới 1 triệu</MenuItem>
                      <MenuItem value="medium">1 - 3 triệu</MenuItem>
                      <MenuItem value="high">Trên 3 triệu</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                <div className="mt-4">
                  <StarSort />
                </div>
              </div>
            </details>
          ) : (
            <Sticky top={80} innerZ={40} bottomBoundary=".main-content">
              <div className="rounded-lg p-4 shadow-lg space-y-4">
                <div>
                  <div className="font-bold mb-2">Chọn tỉnh thành</div>
                  <FormControl fullWidth variant="outlined" size="small">
                    <Select
                      labelId="province-label"
                      value={selectedProvince}
                      onChange={(e) =>
                        setSelectedProvince(e.target.value as number)
                      }
                      MenuProps={MenuProps}
                    >
                      <MenuItem value="">
                        <em>-- Chọn tỉnh --</em>
                      </MenuItem>
                      {provinces.map((p) => (
                        <MenuItem key={p.province_id} value={p.province_id}>
                          {p.province_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div>
                  <div className="font-bold mb-2">Mức giá</div>
                  <FormControl fullWidth variant="outlined" size="small">
                    <Select
                      value={priceFilter}
                      onChange={handlePriceFilterChange}
                    >
                      <MenuItem value="all">Tất cả mức giá</MenuItem>
                      <MenuItem value="low">Dưới 1 triệu</MenuItem>
                      <MenuItem value="medium">1 - 3 triệu</MenuItem>
                      <MenuItem value="high">Trên 3 triệu</MenuItem>
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
          className="flex flex-col gap-5 main-content w-full"
        >
          {hotelList.length > 0 ? (
            hotelList.map((hotel) => (
              <HotelItem item={hotel} key={hotel.hotelID} />
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              Không tìm thấy khách sạn nào phù hợp với tiêu chí của bạn
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

      {user && user.role === "Customer" && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col gap-5 main-content w-full"
        >
          <div className="w-full relative mt-20 mb-[-1.8rem]">
            <div>
              <img
                className="w-full h-70 object-cover absolute z-10"
                src={assets.hotel_background}
                alt="hotel background"
              />
              <div className="absolute inset-0 bg-black/50 h-70 z-20"></div>

              <div className="relative z-30 flex flex-col justify-center w-2/5 mx-auto h-72 text-center">
                <h1 className="font-bold text-4xl text-white">
                  Đăng ký khách sạn của bạn
                </h1>
                <p className="font-light mt-4 text-lg text-white">
                  Thêm khách sạn vào hệ thống và bắt đầu hợp tác cùng chúng tôi.
                </p>
                <Button
                  variant="contained"
                  onClick={() => navigate("/hotel_create")}
                  size="medium"
                  sx={{
                    backgroundColor: "#3B82F6",
                    borderRadius: "10px",
                    "&:hover": {
                      backgroundColor: "#2563EB",
                    },
                    marginTop: 3,
                    width: "300px",
                    paddingY: 2,
                    marginX: "auto",
                  }}
                >
                  Tạo khách sạn ngay
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Hotel;
