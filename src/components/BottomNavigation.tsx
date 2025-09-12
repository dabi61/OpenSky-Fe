import React, { useState } from "react";
import {
  LayoutDashboard,
  UsersRound,
  UserCheck,
  TentTree,
  Hotel,
  TicketPercent,
  ReceiptText,
  TicketX,
  Bus,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { NavLink } from "react-router-dom";

const BottomNavigation: React.FC = () => {
  const [emblaRef] = useEmblaCarousel({
    axis: "x",
    align: "start",
    dragFree: false,
    containScroll: "trimSnaps",
  });

  const [isVisible, setIsVisible] = useState(false);

  const navItems = [
    {
      id: "dashboard",
      icon: <LayoutDashboard size={24} />,
      label: "Thống kê",
      to: "dashboard",
    },
    {
      id: "bill",
      icon: <ReceiptText size={24} />,
      label: "Bill",
      to: "/unauthorized",
    },
    {
      id: "schedule",
      icon: <Bus size={24} />,
      label: "Lịch trình",
      to: "/unauthorized",
    },
    {
      id: "refund",
      icon: <TicketX size={24} />,
      label: "Hoàn tiền",
      to: "/unauthorized",
    },
    { id: "tour", icon: <TentTree size={24} />, label: "Tour", to: "/bill" },
    { id: "hotel", icon: <Hotel size={24} />, label: "Khách sạn", to: "/bill" },
    {
      id: "sale",
      icon: <TicketPercent size={24} />,
      label: "Ưu đãi",
      to: "/unauthorized",
    },
    {
      id: "customer",
      icon: <UserCheck size={24} />,
      label: "Khách hàng",
      to: "customer",
    },
    {
      id: "staff",
      icon: <UsersRound size={24} />,
      label: "Nhân viên",
      to: "staff",
    },
  ];

  return (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 h-7 cursor-pointer"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      />

      <div
        className={`fixed left-1/2 transform -translate-x-1/2 bg-white rounded-2xl md:w-fit w-[90%] shadow-lg p-2 transition-all duration-300 ${
          isVisible
            ? "bottom-4 opacity-100 visible"
            : "bottom-[-100px] opacity-0 invisible"
        }`}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex">
            {navItems.map((item) => (
              <div
                className="embla__slide flex-shrink-0 min-w-[80px]"
                key={item.id}
              >
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex flex-col items-center p-3 cursor-pointer rounded-xl transition-all w-full ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`
                  }
                >
                  {item.icon}
                  <span className="text-[11px] mt-1">{item.label}</span>
                </NavLink>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomNavigation;
