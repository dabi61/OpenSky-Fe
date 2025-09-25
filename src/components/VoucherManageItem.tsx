import type { FC } from "react";
import type { VoucherType } from "../types/response/voucher.type";
import dayjs from "dayjs";

type Props = {
  voucher: VoucherType;
  onEdit: () => void;
  onDelete?: () => void;
};

const VoucherMangeItem: FC<Props> = ({ voucher, onEdit, onDelete }) => {
  const now = dayjs();

  const showActions = dayjs(voucher.startDate).isAfter(now);
  return (
    <div
      key={voucher.voucherID}
      className="bg-white rounded-lg shadow p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
          {voucher.tableType}
        </span>
        <span
          className={`text-xs font-medium px-2.5 py-0.5 rounded ${
            voucher.isExpired
              ? "bg-red-100 text-red-800"
              : voucher.isAvailable
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {voucher.isExpired
            ? "Hết hạn"
            : voucher.isAvailable
            ? "Khả dụng"
            : "Không khả dụng"}
        </span>
      </div>

      <h3 className="font-bold text-lg mb-2">{voucher.code}</h3>
      <div className="text-gray-600 text-sm mb-3 line-clamp-2">
        {voucher.description || <div className="mt-5"></div>}
      </div>

      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-bold text-blue-600">
          {voucher.percent}%
        </span>
        <span className="text-sm text-gray-500">
          Đã dùng: {voucher.usedCount}
        </span>
      </div>

      <div className="text-xs text-gray-500 mb-3">
        <div>
          Bắt đầu:
          {voucher.startDate
            ? dayjs(voucher.startDate).format("DD/MM/YYYY")
            : ""}
        </div>
        <div>
          Kết thúc:{" "}
          {voucher.endDate ? dayjs(voucher.endDate).format("DD/MM/YYYY") : ""}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        {showActions && (
          <button
            className="px-3 py-1 bg-yellow-500 cursor-pointer text-white rounded text-sm hover:bg-yellow-600"
            onClick={onEdit}
          >
            Sửa
          </button>
        )}
        <button
          className="px-3 py-1 cursor-pointer bg-red-500 text-white rounded text-sm hover:bg-red-600"
          onClick={onDelete}
        >
          Xóa
        </button>
      </div>
    </div>
  );
};

export default VoucherMangeItem;
