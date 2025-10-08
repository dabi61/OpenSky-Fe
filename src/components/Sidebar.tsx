import { ReceiptText, Star, TicketPercent, User } from "lucide-react";
import { NavLink } from "react-router-dom";

interface MenuItem {
  icon: React.ReactElement;
  label: string;
  to: string;
}

function Sidebar() {
  const menuItems: MenuItem[] = [
    { icon: <User />, label: "Hồ sơ", to: "/profile" },
    { icon: <TicketPercent />, label: "Mã giảm giá", to: "/user_voucher" },
    { icon: <ReceiptText />, label: "Đơn đặt chỗ", to: "/my_bills" },
    { icon: <Star />, label: "Đánh giá của bạn", to: "/my_reviews" },
  ];

  const NavItem = ({ item }: { item: MenuItem }) => (
    <NavLink
      className={({ isActive }) =>
        `w-full text-left px-4 py-5 text-sm rounded-md flex items-center gap-2 ${
          isActive
            ? "bg-blue-400 font-semibold text-white shadow-md"
            : "text-gray-600 hover:text-blue-400"
        }`
      }
      to={item.to}
    >
      {item.icon}
      <div className="hidden md:block">{item.label}</div>
    </NavLink>
  );

  return (
    <div className="flex h-fit md:flex-col flex-row w-fit shadow-lg rounded-2xl p-4 gap-3">
      {menuItems.map((item, index) => (
        <NavItem key={index} item={item} />
      ))}
    </div>
  );
}

export default Sidebar;
