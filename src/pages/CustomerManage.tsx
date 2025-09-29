import React, { useEffect, useState, type ChangeEvent } from "react";
import { Search, User, Plus } from "lucide-react";
import { useUser } from "../contexts/UserContext";
import { Roles } from "../constants/role";
import type { UserType } from "../types/response/user.type";
import CustomerManageItem from "../components/CustomerManagerItem";
import CustomerModal from "../components/CustomerModal";
import Pagination from "../components/Pagination";
import useQueryState from "../hooks/useQueryState";

const CustomerManager: React.FC = () => {
  const { getUsersByRole, userList, keyword, setKeyword, searchUsersByRole } =
    useUser();

  const [page, setPage] = useQueryState("page", "1" as string);

  const [selectedCustomer, setSelectedCustomer] = useState<UserType | null>(
    null
  );

  const [currentPage, setCurrentPage] = useState(() => {
    return page ? parseInt(page) : 1;
  });

  const [totalPages, setTotalPages] = useState(0);
  const [openAddCustomer, setOpenAddCustomer] = useState(false);
  const pageSize = 20;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        if (keyword) {
          const data = await searchUsersByRole(
            keyword,
            [Roles.CUSTOMER],
            currentPage,
            pageSize
          );
          setTotalPages(data.totalPages);
        } else {
          const data = await getUsersByRole(
            [Roles.CUSTOMER],
            currentPage,
            pageSize
          );
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      }
    };

    fetchCustomers();
  }, [currentPage, keyword]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setPage(newPage.toString());
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-center mt-4">
        <div className="flex flex-wrap gap-1 justify-center">
          <Pagination
            page={Number(page)}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
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
              Quản Lý Khách Hàng
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Danh sách khách hàng trong hệ thống
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
            {userList.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                          Khách hàng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hidden md:table-cell">
                          Thông tin liên hệ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hidden lg:table-cell">
                          CCCD/CMND
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hidden xl:table-cell">
                          Ngày sinh
                        </th>
                        <th className="text-right py-4 px-4 sm:px-6 font-semibold text-gray-700"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {userList.map((customer) => (
                        <CustomerManageItem
                          customer={customer}
                          key={customer.userID}
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
                  Không có khách hàng nào
                </h3>
                <p className="text-gray-400 mt-1">
                  Hãy thêm khách hàng mới vào hệ thống
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <CustomerModal
        isOpen={openAddCustomer}
        onClose={() => {
          setOpenAddCustomer(false);
          setTimeout(() => {
            setSelectedCustomer(null);
          }, 500);
        }}
        data={selectedCustomer}
      />
    </>
  );
};

export default CustomerManager;
