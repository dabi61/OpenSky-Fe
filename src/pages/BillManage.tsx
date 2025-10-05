import { useEffect, useState, type FC } from "react";
import { useBill } from "../contexts/BillContext";
import useQueryState from "../hooks/useQueryState";
import OverlayReload from "../components/Loading";
import { CreditCard, Search } from "lucide-react";
import type { BillType } from "../types/response/bill.type";
import Pagination from "../components/Pagination";
import BillManageItem from "../components/BillManageItem";

const BillManage: FC = () => {
  const { getAllBill, billList, loading } = useBill();
  const [page, setPage] = useQueryState("page", "1" as string);
  const [totalPages, setTotalPages] = useState(0);

  const fetchBills = async () => {
    try {
      const res = await getAllBill(Number(page), 20);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error("Failed to fetch billList:", error);
    }
  };

  useEffect(() => {
    fetchBills();
  }, [page]);

  if (loading || !billList) {
    return <OverlayReload />;
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage.toString());
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow mb-8 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search bill..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách Hàng
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dịch Vụ
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá Trị
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Voucher
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng Thái
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày Tạo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {billList.map((bill: BillType) => (
                  <BillManageItem bill={bill} />
                ))}
              </tbody>
            </table>
          </div>

          {billList.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Không có hóa đơn
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Chưa có hóa đơn nào được tạo trong hệ thống.
              </p>
            </div>
          )}

          <div className="mb-5">
            <Pagination
              page={Number(page)}
              totalPages={totalPages}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillManage;
