import { useEffect, useState, type FC } from "react";
import { useRefund } from "../contexts/RefundContext";
import OverlayReload from "../components/Loading";
import useQueryState from "../hooks/useQueryState";
import { Chip, Avatar, Typography, Box, Button } from "@mui/material";
import {
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import dayjs from "dayjs";
import type { RefundType } from "../types/response/refund.type";

const RefundManage: FC = () => {
  const { getAllRefunds, refundList, loading } = useRefund();
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useQueryState("page", "1" as string);

  const fetchTours = async () => {
    try {
      const currentPage = parseInt(page);
      const data = await getAllRefunds(currentPage, 20);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch tourList:", error);
    }
  };

  useEffect(() => {
    fetchTours();
  }, [page]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Rejected":
        return "error";
      case "Pending":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    const iconProps = { size: 16 };
    switch (status) {
      case "Completed":
        return <CheckCircle {...iconProps} />;
      case "Rejected":
        return <XCircle {...iconProps} />;
      case "Pending":
        return <Clock {...iconProps} />;
      default:
        return <Clock {...iconProps} />;
    }
  };

  if (loading) {
    return <OverlayReload />;
  }

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
                Mã Bill
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {refundList.length > 0 ? (
              refundList.map((refund) => (
                <tr
                  key={refund.refundID}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Box className="flex items-center gap-3">
                      <Avatar
                        src={refund.user.avatarURL}
                        alt={refund.user.fullName}
                        className="w-10 h-10"
                      >
                        {refund.user.fullName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          className="font-semibold text-gray-900"
                        >
                          {refund.user.fullName}
                        </Typography>
                        <Typography variant="body2" className="text-gray-500">
                          {refund.user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <Typography
                      variant="body2"
                      className="font-mono text-gray-900"
                    >
                      {refund.billID.slice(0, 8)}...
                    </Typography>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <Typography
                      variant="body2"
                      className="font-semibold text-green-600"
                    >
                      {Intl.NumberFormat("vi-VN").format(refund.refundAmount)}{" "}
                      VNĐ
                    </Typography>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <Chip
                      label={`${refund.refundPercentage}%`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <Typography variant="body2" className="text-gray-900">
                      {dayjs(refund.createdAt).format("DD/MM/YYYY")}
                    </Typography>
                    <Typography variant="caption" className="text-gray-500">
                      {dayjs(refund.createdAt).format("HH:mm")}
                    </Typography>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <Chip
                      icon={getStatusIcon(refund.status)}
                      label={refund.status}
                      color={getStatusColor(refund.status)}
                      variant="filled"
                      size="small"
                    />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <Box className="flex gap-2">
                      {refund.status === "Pending" && (
                        <>
                          <Button
                            size="small"
                            startIcon={<CheckCircle size={16} />}
                            variant="contained"
                            color="success"
                            className="text-xs"
                          >
                            Duyệt
                          </Button>
                          <Button
                            size="small"
                            startIcon={<XCircle size={16} />}
                            variant="outlined"
                            color="error"
                            className="text-xs"
                          >
                            Từ chối
                          </Button>
                        </>
                      )}
                    </Box>
                  </td>
                </tr>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <Box className="flex justify-center mt-4">
          <Box className="flex gap-1">
            <Button
              variant="outlined"
              size="small"
              startIcon={<ChevronLeft size={16} />}
              onClick={() => setPage((parseInt(page) - 1).toString())}
              disabled={parseInt(page) === 1}
            >
              Trước
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <Button
                  key={pageNum}
                  variant={
                    parseInt(page) === pageNum ? "contained" : "outlined"
                  }
                  size="small"
                  onClick={() => setPage(pageNum.toString())}
                >
                  {pageNum}
                </Button>
              )
            )}
            <Button
              variant="outlined"
              size="small"
              endIcon={<ChevronRight size={16} />}
              onClick={() => setPage((parseInt(page) + 1).toString())}
              disabled={parseInt(page) === totalPages}
            >
              Sau
            </Button>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default RefundManage;
