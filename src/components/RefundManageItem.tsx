import type { FC } from "react";
import type { RefundType } from "../types/response/refund.type";
import { Avatar, Box, Button, Chip, Typography } from "@mui/material";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

type Props = {
  refund: RefundType;
  onApprove: () => void;
  onReject: () => void;
};

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

const RefundManageItem: FC<Props> = ({ refund, onApprove, onReject }) => {
  const navigate = useNavigate();
  return (
    <tr
      key={refund.refundID}
      className="hover:bg-blue-50 transition-colors border-b border-blue-100"
      onClick={() => navigate(`/manager/refund_info/${refund.refundID}`)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <Box className="flex items-center gap-3">
          <Avatar
            className="w-9 h-9 border border-blue-200"
            src={
              refund.user.avatarURL ||
              `${import.meta.env.VITE_AVATAR_API}${refund.user.fullName}`
            }
            alt={refund.user.fullName}
          />
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
        <Typography variant="body2" className="font-semibold text-blue-600">
          {Intl.NumberFormat("vi-VN").format(refund.refundAmount)} VNĐ
        </Typography>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <Chip
          label={`${refund.refundPercentage}%`}
          size="small"
          sx={{
            color: "#1976d2",
            backgroundColor: "#e3f2fd",
            borderColor: "#1976d2",
            "&:hover": {
              backgroundColor: "#bbdefb",
            },
          }}
          variant="outlined"
        />
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <Typography variant="body2" className="text-gray-900 font-medium">
          {dayjs(refund.createdAt).format("DD/MM/YYYY")}
        </Typography>
        <Typography variant="caption" className="text-blue-500">
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
                sx={{
                  backgroundColor: "#1976d2",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onApprove();
                }}
              >
                Duyệt
              </Button>
              <Button
                size="small"
                startIcon={<XCircle size={16} />}
                variant="outlined"
                sx={{
                  color: "#1976d2",
                  borderColor: "#1976d2",
                  "&:hover": {
                    backgroundColor: "#e3f2fd",
                    borderColor: "#1565c0",
                  },
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onReject();
                }}
              >
                Từ chối
              </Button>
            </>
          )}
        </Box>
      </td>
    </tr>
  );
};
export default RefundManageItem;
