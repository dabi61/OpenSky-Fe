import { useEffect, useState, type ChangeEvent } from "react";
import { useUser } from "../contexts/UserContext";
import type { UserType } from "../types/response/user";
import { useSearchParams } from "react-router-dom";
import { Roles } from "../constants/role";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Search,
  User,
} from "lucide-react";
import StaffManageItem from "../components/StaffManageItem";
import StaffModal from "../components/StaffModal";

const StaffManager: React.FC = () => {
  const { getUsersByRole, userList, keyword, setKeyword, searchUsersByRole } =
    useUser();
  const [staffs, setStaffs] = useState<UserType[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = searchParams.get("page");
  const [selectedCustomer, setSelectedCustomer] = useState<UserType | null>(
    null
  );

  const [currentPage, setCurrentPage] = useState(() => {
    return pageParam ? parseInt(pageParam) : 0;
  });

  const [totalPages, setTotalPages] = useState(0);
  const [openAddCustomer, setOpenAddCustomer] = useState(false);
  const pageSize = 20;

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", currentPage.toString());
    setSearchParams(newSearchParams);
  }, [currentPage, searchParams, setSearchParams]);
  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        if (keyword) {
          const data = await searchUsersByRole(
            keyword,
            [Roles.TOURGUIDE, Roles.SUPERVISOR],
            currentPage,
            pageSize
          );
          setStaffs(data.content);
          setTotalPages(data.totalPages);
        } else {
          const data = await getUsersByRole(
            [Roles.TOURGUIDE, Roles.SUPERVISOR],
            currentPage,
            pageSize
          );
          setStaffs(data.content);
          setTotalPages(Math.max(data.totalPages));
        }
      } catch (error) {
        console.error("Failed to fetch staffs:", error);
      }
    };

    fetchStaffs();
  }, [currentPage, getUsersByRole, keyword]);

  useEffect(() => {
    if (currentPage === 0 && userList.length > 0) {
      setStaffs(userList);
    }
  }, [userList, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-center mt-4">
        <div className="flex flex-wrap gap-1 justify-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i;
            } else if (currentPage <= 2) {
              pageNum = i;
            } else if (currentPage >= totalPages - 3) {
              pageNum = totalPages - 5 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-1 border rounded-md text-sm ${
                  currentPage === pageNum
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {pageNum + 1}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Quản Lý Nhân viên
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Danh sách nhân viên trong hệ thống
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="relative w-full md:flex-grow">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={keyword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setKeyword(e.target.value)
                  }
                />
              </div>
              <button className="flex items-center justify-center border gap-2 text-gray-700 px-4 py-2 rounded-lg hover:text-gray-900 w-full md:w-auto cursor-pointer">
                <Filter />
                <span>Lọc</span>
              </button>
              <div className="flex gap-2 w-full md:w-auto">
                <button
                  className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full md:w-auto cursor-pointer"
                  onClick={() => setOpenAddCustomer(true)}
                >
                  <Plus size={18} className="mr-2" />
                  <span className="hidden sm:inline whitespace-nowrap">
                    Thêm mới
                  </span>
                  <span className="sm:hidden">Thêm</span>
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {staffs.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left py-4 px-4 sm:px-6 font-semibold text-gray-700">
                          Nhân viên
                        </th>
                        <th className="text-left py-4 px-4 sm:px-6 font-semibold text-gray-700 hidden md:table-cell">
                          Thông tin liên hệ
                        </th>
                        <th className="text-left py-4 px-4 sm:px-6 font-semibold text-gray-700 hidden lg:table-cell">
                          Chức vụ
                        </th>
                        <th className="text-left py-4 px-4 sm:px-6 font-semibold text-gray-700 hidden lg:table-cell">
                          CCCD/CMND
                        </th>
                        <th className="text-left py-4 px-4 sm:px-6 font-semibold text-gray-700 hidden xl:table-cell">
                          Ngày sinh
                        </th>
                        <th className="text-right py-4 px-4 sm:px-6 font-semibold text-gray-700"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {staffs.map((customer) => (
                        <StaffManageItem
                          staff={customer}
                          key={customer.id}
                          onEdit={() => {
                            setSelectedCustomer(customer);
                            setOpenAddCustomer(true);
                          }}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-gray-200 px-4 sm:px-6 py-4">
                  {renderPagination()}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <User size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-500">
                  Không có nhân viên
                </h3>
                <p className="text-gray-400 mt-1">
                  Hãy thêm nhân viên mới vào hệ thống
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <StaffModal
        isOpen={openAddCustomer}
        onClose={() => {
          setOpenAddCustomer(false);
          setSelectedCustomer(null);
        }}
        data={selectedCustomer}
      />
    </>
  );
};
export default StaffManager;
