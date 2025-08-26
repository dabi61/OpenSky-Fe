import { NavLink } from "react-router-dom";
import assets from "../assets";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { AlignJustify } from "lucide-react";

const menuItems = [
  { name: "Trang chủ", to: "/home" },
  { name: "Tour", to: "/" },
  { name: "Khách sạn", to: "/" },
  { name: "Ưu đãi", to: "/" },
  { name: "Liên hệ", to: "/" },
  { name: "Đăng nhập", to: "/login" },
  { name: "Đăng ký", to: "/register" },
];

function Header() {
  return (
    <div className="flex justify-between w-full px-10 items-center fixed h-20 bg-white z-100 shadow-md">
      <img className="md:w-20 w-15" src={assets.logo} alt="Logo" />

      <div className="hidden lg:flex gap-10 items-center font-thin text-sm">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              `px-3.5 py-2 rounded transition ${
                isActive
                  ? "bg-blue-400 font-semibold text-white shadow-md"
                  : "hover:text-blue-400"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>

      <div className="lg:hidden flex items-center mr-[-30px]">
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="z-30 rounded-md px-4 py-2 text-sm font-medium cursor-pointer">
            <AlignJustify className="text-black" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
              {menuItems.map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <NavLink
                      to={item.to}
                      className={`${
                        active
                          ? "bg-blue-400 font-semibold text-white shadow-md"
                          : "hover:text-blue-400"
                      } block w-full text-left px-4 py-2 text-sm rounded-md`}
                    >
                      {item.name}
                    </NavLink>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}

export default Header;
