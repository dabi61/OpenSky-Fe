import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useTour } from "../contexts/TourContext";
import { useNavigate } from "react-router-dom";
import TourManageItem from "../components/TourManageItem";
import useQueryState from "../hooks/useQueryState";
import Modal from "../components/Modal";
import { toast } from "sonner";
import { handleSoftDeleteTour } from "../api/tour.api";

const TourManage: FC = () => {
  const { getAllTours, tourList } = useTour();

  const navigate = useNavigate();
  const [provinceFilter, setProvinceFilter] = useState<string>("All");
  const [totalPages, setTotalPages] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState<string>("");
  const [page, setPage] = useQueryState("page", "1" as string);

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
  }, [page, getAllTours]);

  const handleDelete = async (id: string) => {
    const res = await handleSoftDeleteTour(id);
    if (res.success) {
      toast.success(res.message);
      setOpenModal(false);
      fetchTours();
    } else {
      toast.error(res.message);
      setOpenModal(false);
    }
  };

  const provinces = Array.from(new Set(tourList.map((tour) => tour.province)));

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Quản lý tour</h1>
            <p className="text-gray-600 mt-2">Quản lý thông tin các tour</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex gap-3">
              <div className="relative w-full flex flex-col">
                <div className="flex justify-end relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên tour"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <select
                  className="block w-40 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={provinceFilter}
                  onChange={(e) => setProvinceFilter(e.target.value)}
                >
                  <option value="All">All Provinces</option>
                  {provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => navigate("/manager/tour_create")}
                  className="cursor-pointer whitespace-nowrap bg-blue-600  hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center w-full justify-center gap-2"
                >
                  <Plus />
                  Thêm mới
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-hidden h-full">
            <div className="overflow-x-auto flex flex-col gap-10">
              {tourList.length > 0 ? (
                tourList.map((tour) => (
                  <TourManageItem
                    tour={tour}
                    key={tour.tourID}
                    onClick={() => navigate(`/tour_info/${tour.tourID}`)}
                    onEdit={() => {
                      navigate(`/manager/tour_edit/${tour.tourID}`);
                    }}
                    onDelete={() => {
                      setSelectedTourId(tour.tourID);
                      setOpenModal(true);
                    }}
                  />
                ))
              ) : (
                <div className="px-6 py-4 text-center text-sm text-gray-500">
                  No tourList found matching your criteria.
                </div>
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
          </div>
        </div>
      </div>
      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        description="Bạn có muốn xóa tour này khỏi hệ thống?"
        title="Thông báo"
        onAgree={() => handleDelete(selectedTourId)}
      />
    </>
  );
};

export default TourManage;
