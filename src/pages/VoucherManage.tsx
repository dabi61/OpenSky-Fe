import React, { useEffect, useState } from "react";
import { MapPin, Plus, Search, Funnel } from "lucide-react";
import { useVoucher } from "../contexts/VoucherContext";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { CircularProgress } from "@mui/material";
import useQueryState from "../hooks/useQueryState";
import useOptionalQueryState from "../hooks/useOptionalQueryState";
import Modal from "../components/Modal";
import { VoucherEnum } from "../constants/VoucherEnum";
import VoucherMangeItem from "../components/VoucherManageItem";
import VoucherModal from "../components/VoucherModal";
import { toast } from "sonner";
import { handleSoftDeleteVoucher } from "../api/voucher.api";
import Pagination from "../components/Pagination";

const VoucherManage: React.FC = () => {
  const {
    voucherList,
    loading,
    selectedVoucher,
    getVoucherByType,
    setSelectedVoucher,
    getAllVoucher,
    keyword,
    setKeyword,
    searchManageVoucher,
  } = useVoucher();
  const [page, setPage] = useQueryState("page", "1" as string);
  const [openModal, setOpenModal] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedType, setSelectedType] =
    useOptionalQueryState<VoucherEnum>("type");
  const [keywordQuery, setKeywordQuery] = useOptionalQueryState("keyword");
  const [inputValue, setInputValue] = useState(keyword ?? "");
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage.toString());
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const fetchVouchers = async () => {
    try {
      const currentPage = parseInt(page);
      let data;

      if (keyword?.trim()) {
        data = await searchManageVoucher(
          currentPage,
          20,
          selectedType ?? undefined
        );
      } else if (selectedType) {
        data = await getVoucherByType(selectedType, currentPage, 20);
      } else {
        data = await getAllVoucher(currentPage, 20);
      }
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch voucherList:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedVoucher?.voucherID) return;
    const res = await handleSoftDeleteVoucher(selectedVoucher.voucherID);
    if (res.success) {
      toast.success(res.message);
      getAllVoucher(parseInt(page), 20);
    } else {
      toast.error(res.message);
    }
    setSelectedVoucher(null);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setKeyword(inputValue);
      setKeywordQuery(inputValue || undefined);
    }, 500);

    return () => clearTimeout(timeout);
  }, [inputValue]);

  useEffect(() => {
    fetchVouchers();
  }, [selectedType, page, keyword]);

  useEffect(() => {
    setPage("1");
  }, [selectedType]);

  useEffect(() => {
    setPage("1");
  }, [selectedType]);

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow mb-8 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm voucher theo mã hoặc mô tả..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
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
                          setSelectedType(undefined);
                          close();
                        }}
                        className="block rounded-lg px-3 pr-10 py-2 transition hover:bg-gray-100 cursor-pointer"
                      >
                        All
                      </div>

                      {(Object.values(VoucherEnum) as VoucherEnum[]).map(
                        (type) => (
                          <div
                            key={type}
                            onClick={() => {
                              setSelectedType(type);
                              close();
                            }}
                            className="block rounded-lg px-3 pr-10 py-2 transition hover:bg-gray-100 cursor-pointer"
                          >
                            {type}
                          </div>
                        )
                      )}
                    </>
                  )}
                </PopoverPanel>
              </Popover>

              <div className="flex items-center space-x-4">
                <button
                  className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                  onClick={() => setOpenCreateModal(true)}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Thêm voucher
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full mb-10 flex justify-center items-center py-10">
                <CircularProgress />
              </div>
            ) : (
              voucherList.map((voucher) => (
                <VoucherMangeItem
                  key={voucher.voucherID}
                  voucher={voucher}
                  onEdit={() => {
                    setSelectedVoucher(voucher);
                    setOpenCreateModal(true);
                  }}
                  onDelete={() => {
                    setSelectedVoucher(voucher);
                    setOpenModal(true);
                  }}
                />
              ))
            )}
          </div>

          <Pagination
            page={Number(page)}
            onChange={handlePageChange}
            totalPages={totalPages}
          />

          {voucherList.length === 0 && !loading && (
            <div className="bg-white rounded-lg shadow p-12 text-center mt-8">
              <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Không tìm thấy voucher
              </h3>
              <p className="text-gray-500 mb-6">
                {keywordQuery
                  ? "Hãy thử điều chỉnh tìm kiếm hoặc bộ lọc để tìm thấy nội dung bạn cần."
                  : "Bắt đầu bằng cách thêm voucher mới."}
              </p>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center"
                onClick={() => {
                  setSelectedVoucher(null);
                  setOpenCreateModal(true);
                }}
              >
                <Plus className="h-5 w-5 mr-2" />
                Thêm voucher
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        description="Bạn có muốn xóa voucher này khỏi hệ thống?"
        title="Thông báo"
        onAgree={() => {
          handleDelete();
          setOpenModal(false);
        }}
      />

      <VoucherModal
        isOpen={openCreateModal}
        onClose={() => {
          setOpenCreateModal(false);
          setTimeout(() => {
            setSelectedVoucher(null);
          }, 500);
        }}
        data={selectedVoucher || null}
        onSuccess={() => getAllVoucher(Number(page), 20)}
      />
    </>
  );
};

export default VoucherManage;
