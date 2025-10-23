import React from "react";
import type { UserType } from "../types/response/user.type";
import assets from "../assets";
import { Edit, Mail, Phone, Trash2 } from "lucide-react";
import dayjs from "dayjs";

interface Props {
  customer: UserType;
  onEdit: () => void;
  onDelete: () => void;
}

const CustomerManageItem: React.FC<Props> = ({
  customer,
  onEdit,
  onDelete,
}) => {
  return (
    <tr key={customer.userID} className="hover:bg-gray-50">
      <td className="py-4 px-4 sm:px-6">
        <div className="flex items-center">
          <img
            src={customer.avatarURL || assets.logo}
            alt={customer.fullName}
            className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 object-cover"
            onError={(e) => {
              e.currentTarget.src = assets.logo;
            }}
          />
          <div>
            <div
              className="font-medium text-gray-900 truncate max-w-40"
              title={customer.fullName || "Chưa cập nhật"}
            >
              {customer.fullName || "Chưa cập nhật"}
            </div>
            <div className="md:hidden text-sm text-gray-500 mt-1">
              {customer.citizenId || "Chưa cập nhật CCCD"}
            </div>
            <div className="md:hidden text-sm text-gray-500">
              {customer.dob
                ? dayjs(customer.dob).format("DD/MM/YYYY")
                : "Chưa cập nhật NS"}
            </div>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 sm:px-6 hidden md:table-cell">
        <div className="space-y-1">
          <div className="flex items-center text-gray-700">
            <Mail size={16} className="mr-2 text-gray-400" />
            <span className="text-sm">{customer.email}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Phone size={16} className="mr-2 text-gray-400" />
            <span className="text-sm">
              {customer.phoneNumber || "Chưa cập nhật"}
            </span>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 sm:px-6 text-gray-700 hidden lg:table-cell">
        {customer.citizenId || "Chưa cập nhật"}
      </td>
      <td className="py-4 px-4 sm:px-6 text-gray-700 hidden xl:table-cell">
        {customer.dob
          ? dayjs(customer.dob).format("DD/MM/YYYY")
          : "Chưa cập nhật"}
      </td>
      <td className="py-4 px-4 sm:px-6">
        <div className="flex justify-end gap-2">
          <button
            className="p-2 cursor-pointer text-blue-600 hover:bg-blue-50 rounded-lg"
            title="Chỉnh sửa"
            onClick={onEdit}
          >
            <Edit size={18} />
          </button>
          <button
            className="p-2 cursor-pointer text-red-600 hover:bg-red-50 rounded-lg"
            title="Xóa"
            onClick={onDelete}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CustomerManageItem;
