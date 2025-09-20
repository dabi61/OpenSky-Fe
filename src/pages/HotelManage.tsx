import React, { useEffect, useState } from "react";
import {
  MapPin,
  Plus,
  Search,
  Funnel,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { HotelStatus } from "../constants/HotelStatus";
import { useHotel } from "../contexts/HotelContext";
import HotelManageItem from "../components/HotelManageItem";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { CircularProgress } from "@mui/material";
import useQueryState from "../hooks/useQueryState";
import useOptionalQueryState from "../hooks/useOptionalQueryState";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { handleUpdateHotelStatus } from "../api/hotel.api";
import { toast } from "sonner";

const HotelManage: React.FC = () => {
  const { hotelList, loading, getHotelBySatus, getAllHotelExceptRemoved } =
    useHotel();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useQueryState("page", "1" as string);
  const [selectedHotelId, setSelectedHotelId] = useState<string>("");
  const [openModal, setOpenModal] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedStatus, setSelectedStatus] =
    useOptionalQueryState<HotelStatus>("status");

  const fetchHotel = async () => {
    try {
      if (!selectedStatus) {
        const data = await getAllHotelExceptRemoved(parseInt(page), 20);
        setTotalPages(data.totalPages);
      } else {
        const data = await getHotelBySatus(selectedStatus, parseInt(page), 20);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch tourList:", error);
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    fetchHotel();
  }, [selectedStatus, page]);

  useEffect(() => {
    setPage("1");
  }, [selectedStatus]);

  const handleDelete = async (id: string) => {
    const res = await handleUpdateHotelStatus(id, "Removed");
    if (res.status) {
      toast.success(res.message);
      setOpenModal(false);
      fetchHotel();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý khách sạn
            </h1>
            <p className="text-gray-600 mt-2">
              Quản lý những khách sạn có trong hệ thống
            </p>
          </div>

          <div className="bg-white rounded-lg shadow mb-8 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search hotels by name or province..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Popover className="p-2 border rounded-md border-gray-400">
                <PopoverButton className="block text-sm/6 font-semibold cursor-pointer text-white/50 focus:outline-none data-active:text-white data-focus:outline data-focus:outline-white data-hover:text-white">
                  <Funnel className="text-gray-500" />
                </PopoverButton>

                <PopoverPanel
                  transition
                  anchor="bottom start"
                  className="divide-y border bg-white shadow-2xl border-gray-100 divide-white/5 rounded-xl text-sm/6 transition duration-200 ease-in-out [--anchor-gap:--spacing(5)] data-closed:-translate-y-1 data-closed:opacity-0"
                >
                  {({ close }) => (
                    <>
                      <div
                        key="all"
                        onClick={() => {
                          setSelectedStatus(undefined); // hoặc "ALL"
                          close(); // đóng popover
                        }}
                        className="block rounded-lg px-3 pr-10 py-2 transition hover:bg-gray-100 cursor-pointer"
                      >
                        All
                      </div>

                      {(Object.values(HotelStatus) as HotelStatus[])
                        .filter(
                          (status): status is Exclude<HotelStatus, "Removed"> =>
                            status !== HotelStatus.REMOVED
                        )
                        .map((status) => (
                          <div
                            key={status}
                            onClick={() => {
                              setSelectedStatus(status);
                              close(); // đóng popover
                            }}
                            className="block rounded-lg px-3 pr-10 py-2 transition hover:bg-gray-100 cursor-pointer"
                          >
                            {status}
                          </div>
                        ))}
                    </>
                  )}
                </PopoverPanel>
              </Popover>
              {/* <div className="flex items-center space-x-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Hotel
                </button>
              </div> */}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full mb-10 flex justify-center items-center py-10">
                <CircularProgress />
              </div>
            ) : (
              hotelList.map((hotel) => (
                <HotelManageItem
                  hotel={hotel}
                  key={hotel.hotelID}
                  onClick={() => navigate(`/hotel_info/${hotel.hotelID}`)}
                  onDelete={() => {
                    setSelectedHotelId(hotel.hotelID);
                    setOpenModal(true);
                  }}
                  onEdit={() => navigate(`/hotel_edit/${hotel.hotelID}`)}
                />
              ))
            )}
          </div>
          {totalPages > 1 && (
            <div className="flex flex-wrap gap-1 py-5 justify-center">
              <button
                onClick={() => setPage((parseInt(page) - 1).toString())}
                disabled={parseInt(page) === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (parseInt(page) <= 2) {
                  pageNum = i + 1;
                } else if (parseInt(page) >= totalPages - 3) {
                  pageNum = totalPages - 5 + i;
                } else {
                  pageNum = parseInt(page) - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum.toString())}
                    className={`px-3 py-1 border rounded-md text-sm ${
                      parseInt(page) === pageNum
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setPage((parseInt(page) + 1).toString())}
                disabled={parseInt(page) === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {hotelList.length === 0 && (
            <div className="bg-white rounded-lg shadow p-12 text-center mt-8">
              <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No hotels found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? "Try adjusting your search or filter to find what you are looking for."
                  : "Get started by adding a new hotel property."}
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Add Hotel
              </button>
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        description="Bạn có muốn xóa khách sạn này khỏi hệ thống?"
        title="Thông báo"
        onAgree={() => handleDelete(selectedHotelId)}
      />
    </>
  );
};

export default HotelManage;
