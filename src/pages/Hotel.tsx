import Sticky from "react-stickynode";
import StarSort from "../components/StarSort";
import HotelItem from "../components/HotelItem";
import { motion } from "framer-motion";
import { Fragment, useEffect, useState } from "react";
import { Button, FormControl, MenuItem, Select } from "@mui/material";
import { Search } from "lucide-react";
import assets from "../assets";
import { useNavigate } from "react-router-dom";
import { useHotel } from "../contexts/HotelContext";
import useQueryState from "../hooks/useQueryState";
import OverlayReload from "../components/Loading";
import { useUser } from "../contexts/UserContext";
import { Popover, Transition } from "@headlessui/react";
import InfiniteScroll from "react-infinite-scroll-component";
import type { HotelType } from "../types/response/hotel.type";
import useOptionalQueryState from "../hooks/useOptionalQueryState";
import { handleGetProvinceByHotel } from "../api/hotel.api";

const Hotel: React.FC = () => {
  const { user } = useUser();
  const {
    getActiveHotel,
    hotelList,
    hotelSearchList,
    searchHotel,
    keyword,
    setKeyword,
    getHotelByStar,
    getHotelByProvince,
  } = useHotel();
  const [provinces, setProvinces] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedProvince, setSelectedProvince] =
    useOptionalQueryState("province");
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const [page, setPage] = useQueryState("page", "1" as string);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showDropdown, setShowDropdown] = useState(false);
  const [visibleResults, setVisibleResults] = useState<HotelType[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [selectedStarQuery, setSelectedStarQuery] =
    useOptionalQueryState("star");

  const selectedStar: number | null = selectedStarQuery
    ? Number(selectedStarQuery)
    : null;
  const handleStarChange = (star: number | null) => {
    setSelectedStarQuery(star !== null ? String(star) : undefined);
  };
  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (keyword.trim().length > 0) {
        await searchHotel(1, 5, false);
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
    }, 400);

    return () => clearTimeout(delaySearch);
  }, [keyword]);

  useEffect(() => {
    if (hotelSearchList.length > 0) {
      const initial = hotelSearchList.slice(0, 5);
      setVisibleResults(initial);
      setHasMore(hotelSearchList.length > 5);
      setShowDropdown(true);
    } else {
      setVisibleResults([]);
      setShowDropdown(false);
    }
  }, [hotelSearchList]);

  const loadMoreResults = () => {
    const next = hotelSearchList.slice(
      visibleResults.length,
      visibleResults.length + 5
    );
    setVisibleResults((prev) => [...prev, ...next]);
    setHasMore(hotelSearchList.length > visibleResults.length + 5);
  };

  useEffect(() => {
    const fetchHotelsByProvince = async () => {
      try {
        const currentPage = parseInt(page);
        let data;

        if (selectedProvince) {
          data = await getHotelByProvince(selectedProvince, currentPage, 20);
        } else if (selectedStar) {
          data = await getHotelByStar(selectedStar, currentPage, 20);
        } else {
          data = await getActiveHotel(currentPage, 20);
        }

        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Failed to fetch hotels:", error);
      }
    };

    fetchHotelsByProvince();
  }, [selectedProvince, page, selectedStar]);

  if (!hotelList) {
    return <OverlayReload />;
  }

  useEffect(() => {
    async function fetchProvinces() {
      const data = await handleGetProvinceByHotel();
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

      <div className="flex justify-center relative">
        <Popover className="relative w-275">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>

          <input
            type="text"
            placeholder="Tìm kiếm khách sạn hoặc điểm đến..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-0"
          />

          <Transition
            as={Fragment}
            show={showDropdown && visibleResults.length > 0}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-50 mt-2 w-full bg-white shadow-lg rounded-lg border h-fit border-gray-200 max-h-80 overflow-hidden">
              <InfiniteScroll
                dataLength={visibleResults.length}
                next={loadMoreResults}
                hasMore={hasMore}
                loader={
                  <div className="text-center py-2 text-sm text-gray-400">
                    Đang tải thêm...
                  </div>
                }
                style={{
                  overflowY: visibleResults.length > 5 ? "auto" : "visible",
                  maxHeight:
                    visibleResults.length > 5 ? "20rem" : "fit-content",
                }}
                scrollThreshold={0.9}
              >
                {visibleResults.map((hotel) => (
                  <div
                    key={hotel.hotelID}
                    onClick={() => navigate(`/hotel_info/${hotel.hotelID}`)}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                  >
                    <span className="font-medium text-gray-800">
                      {hotel.hotelName}
                    </span>
                    <span className="text-sm text-gray-500">
                      {hotel.address}
                    </span>
                  </div>
                ))}
              </InfiniteScroll>
            </Popover.Panel>
          </Transition>
        </Popover>
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
                      value={selectedProvince || ""}
                      onChange={(e) => setSelectedProvince(e.target.value)}
                      MenuProps={MenuProps}
                    >
                      <MenuItem value="">Tất cả</MenuItem>
                      {provinces.map((p, key) => (
                        <MenuItem key={key} value={p}>
                          {p}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div className="mt-4">
                  <StarSort
                    selectedStar={selectedStar}
                    onChange={handleStarChange}
                  />
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
                      value={selectedProvince || ""}
                      onChange={(e) => setSelectedProvince(e.target.value)}
                      MenuProps={MenuProps}
                    >
                      <MenuItem value="">Tất cả</MenuItem>
                      {provinces.map((p, key) => (
                        <MenuItem key={key} value={p}>
                          {p}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="mt-4">
                  <StarSort
                    selectedStar={selectedStar}
                    onChange={handleStarChange}
                  />
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
            <div className="md:w-200 text-center py-16 bg-white rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Không tìm thấy khách sạn nào phù hợp
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
