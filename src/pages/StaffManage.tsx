import { useEffect, useState, type ChangeEvent } from "react";
import { useUser } from "../contexts/UserContext";
import type { UserType } from "../types/response/user.type";
import { Roles } from "../constants/role";
import { Plus, Search, User } from "lucide-react";
import StaffManageItem from "../components/StaffManageItem";
import StaffModal from "../components/StaffModal";
import Pagination from "../components/Pagination";
import useQueryState from "../hooks/useQueryState";

const StaffManager: React.FC = () => {
  const { getUsersByRole, userList, keyword, setKeyword, searchUsersByRole } =
    useUser();

  const [selectedStaff, setSelectedStaff] = useState<UserType | null>(null);
  const [page, setPage] = useQueryState("page", "1" as string);

  const [currentPage, setCurrentPage] = useState(() => {
    return page ? parseInt(page) : 1;
  });

  const handlePageChange = (value: number) => {
    setCurrentPage(value);
    setPage(value.toString());
    window.scrollTo(0, 0);
  };

  const [totalPages, setTotalPages] = useState(0);
  const [openAddStaff, setOpenAddStaff] = useState(false);
  const pageSize = 20;

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
          setTotalPages(data.totalPages);
        } else {
          const data = await getUsersByRole(
            [Roles.TOURGUIDE, Roles.SUPERVISOR],
            currentPage,
            pageSize
          );
          setTotalPages(Math.max(data.totalPages));
        }
      } catch (error) {
        console.error("Failed to fetch staffs:", error);
      }
    };

    fetchStaffs();
  }, [currentPage, keyword]);

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
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
                  onClick={() => setOpenAddStaff(true)}
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
                          Nhân viên
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hidden md:table-cell">
                          Thông tin liên hệ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hidden lg:table-cell">
                          Chức vụ
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
                      {userList.map((staff) => (
                        <StaffManageItem
                          staff={staff}
                          key={staff.userID}
                          onEdit={() => {
                            setSelectedStaff(staff);
                            setOpenAddStaff(true);
                          }}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-gray-200 px-4 sm:px-6 py-4">
                  <Pagination
                    page={Number(page)}
                    onChange={handlePageChange}
                    totalPages={totalPages}
                  />
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
        isOpen={openAddStaff}
        onClose={() => {
          setOpenAddStaff(false);
          setTimeout(() => {
            setSelectedStaff(null);
          }, 500);
        }}
        data={selectedStaff}
      />
    </>
  );
};
export default StaffManager;
