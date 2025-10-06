import { useEffect, useState, type FC } from "react";
import { useSchedule } from "../contexts/ScheduleContext";
import useQueryState from "../hooks/useQueryState";
import OverlayReload from "../components/Loading";
import Pagination from "../components/Pagination";
import type { ScheduleType } from "../types/response/schedule.type";
import ScheduleItem from "../components/ScheduleItem";

const ScheduleManage: FC = () => {
  const { getAllSchedule, scheduleList } = useSchedule();
  const [page, setPage] = useQueryState("page", "1" as string);
  const [totalPages, setTotalPages] = useState(0);

  const fetchSchedules = async () => {
    try {
      const currentPage = parseInt(page);
      const data = await getAllSchedule(currentPage, 20);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch tourList:", error);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [page]);

  if (!scheduleList) {
    return <OverlayReload />;
  }

  const handlePageChange = (value: number) => {
    setPage(value.toString());
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tour
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hướng dẫn viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số người
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {scheduleList.map((schedule: ScheduleType) => (
                  <ScheduleItem schedule={schedule} key={schedule.scheduleID} />
                ))}
              </tbody>
            </table>
          </div>

          {scheduleList.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📅</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không có lịch trình nào
              </h3>
              <p className="text-gray-500">
                Không tìm thấy lịch trình phù hợp với bộ lọc hiện tại.
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          <Pagination
            page={Number(page)}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ScheduleManage;
