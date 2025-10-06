import { useEffect, useState, type FC } from "react";
import { useRefund } from "../contexts/RefundContext";
import OverlayReload from "../components/Loading";
import useQueryState from "../hooks/useQueryState";
import { Typography } from "@mui/material";
import RefundManageItem from "../components/RefundManageItem";
import { handleApproveRefund, handleRejectRefund } from "../api/refund.api";
import { toast } from "sonner";
import Pagination from "../components/Pagination";

const RefundManage: FC = () => {
  const { getAllRefunds, refundList, loading } = useRefund();
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useQueryState("page", "1" as string);

  const fetchTours = async () => {
    try {
      const data = await getAllRefunds(Number(page), 20);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch tourList:", error);
    }
  };

  useEffect(() => {
    fetchTours();
  }, [page]);

  if (loading) {
    return <OverlayReload />;
  }

  const handleApprove = async (id: string) => {
    const res = await handleApproveRefund(id);
    if (res.success) {
      toast.success(res.message);
      await getAllRefunds(Number(page), 20);
    } else {
      toast.error(res.message);
    }
  };

  const handleReject = async (id: string) => {
    const res = await handleRejectRefund(id);
    if (res.success) {
      toast.success(res.message);
      await getAllRefunds(Number(page), 20);
    } else {
      toast.error(res.message);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage.toString());
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden max-w-7xl mx-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                Khách hàng
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                Số tiền hoàn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                Tỷ lệ hoàn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {refundList.length > 0 ? (
              refundList.map((refund) => (
                <RefundManageItem
                  key={refund.refundID}
                  refund={refund}
                  onApprove={() => handleApprove(refund.billID)}
                  onReject={() => handleReject(refund.billID)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center">
                  <Typography variant="body1" className="text-gray-500">
                    Không có yêu cầu hoàn tiền nào
                  </Typography>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={Number(page)}
        onChange={handlePageChange}
        totalPages={totalPages}
      />
    </div>
  );
};

export default RefundManage;
