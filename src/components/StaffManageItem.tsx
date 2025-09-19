import React from "react";
import type { UserType } from "../types/response/user.type";
import assets from "../assets";
import { Edit, Mail, Phone, Trash2, User } from "lucide-react";
import dayjs from "dayjs";
import { Roles } from "../constants/role";

interface Props {
  staff: UserType;
  onEdit: () => void;
  //   onDelete: () => void;
}

const StaffManageItem: React.FC<Props> = ({ staff, onEdit }) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case Roles.TOURGUIDE:
        return "bg-blue-100 text-blue-800";
      case Roles.SUPERVISOR:
        return "bg-green-100 text-green-800";
    }
  };

  return (
    <tr key={staff.id} className="hover:bg-gray-50">
      <td className="py-4 px-4 sm:px-6">
        <div className="flex items-center">
          <div className="relative">
            <img
              src={staff.avatarURL || assets.logo}
              alt={staff.fullName}
              className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 object-cover"
              onError={(e) => {
                e.currentTarget.src = assets.logo;
              }}
            />
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {staff.fullName || "Chưa cập nhật"}
            </div>
            <div className="md:hidden text-sm text-gray-500 mt-1">
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${getRoleColor(
                  staff.role
                )}`}
              >
                {staff.role || "Chưa cập nhật"}
              </span>
            </div>
            <div className="md:hidden text-sm text-gray-500 mt-1">
              {staff.citizenId || "Chưa cập nhật CCCD"}
            </div>
            <div className="md:hidden text-sm text-gray-500">
              {staff.dob
                ? dayjs(staff.dob).format("DD/MM/YYYY")
                : "Chưa cập nhật NS"}
            </div>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 sm:px-6 hidden md:table-cell">
        <div className="space-y-1">
          <div className="flex items-center text-gray-700">
            <Mail size={16} className="mr-2 text-gray-400" />
            <span className="text-sm">{staff.email}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Phone size={16} className="mr-2 text-gray-400" />
            <span className="text-sm">
              {staff.phoneNumber || "Chưa cập nhật"}
            </span>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 sm:px-6 hidden lg:table-cell">
        <span
          className={`px-2 py-1 rounded-full text-xs ${getRoleColor(
            staff.role
          )}`}
        >
          {staff.role || "Chưa cập nhật"}
        </span>
      </td>
      <td className="py-4 px-4 sm:px-6 text-gray-700 hidden xl:table-cell">
        <div className="flex items-center">
          <span className="text-sm">{staff.citizenId || "Chưa cập nhật"}</span>
        </div>
      </td>
      <td className="py-4 px-4 sm:px-6 text-gray-700 hidden xl:table-cell">
        <div className="flex items-center">
          <span className="text-sm">
            {staff.dob
              ? dayjs(staff.dob).format("DD/MM/YYYY")
              : "Chưa cập nhật"}
          </span>
        </div>
      </td>
      <td className="py-4 px-4 sm:px-6">
        <div className="flex justify-end gap-2">
          <button
            className="p-2 cursor-pointer text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Chỉnh sửa"
            onClick={onEdit}
          >
            <Edit size={18} />
          </button>
          <button
            className="p-2 cursor-pointer text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Xóa"
            // onClick={onDelete}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default StaffManageItem;
