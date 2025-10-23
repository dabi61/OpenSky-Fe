import { Link, NavLink, useNavigate } from "react-router-dom";
import assets from "../assets";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { AlignJustify } from "lucide-react";
import { handleLogout } from "../api/auth.api";
import { useUser } from "../contexts/UserContext";
import OverlayReload from "./Loading";
import Cookies from "js-cookie";
import { Roles } from "../constants/role";

const baseMenuItems = [
  { name: "Trang chủ", to: "/home" },
  { name: "Tour", to: "/tour" },
  { name: "Khách sạn", to: "/hotel" },
  { name: "Ưu đãi", to: "/discount" },
  { name: "Liên hệ", to: "/contact" },
  { name: "Quản lý", to: "/manager" },
];

const authMenuItems = [
  { name: "Đăng nhập", to: "/login" },
  { name: "Đăng ký", to: "/register" },
];
function Header() {
  const { user, loading, reloadUser } = useUser();
  const navigate = useNavigate();

  const settingMenuItems = [
    { name: "Cá nhân", to: "/profile" },
    ...(user?.role === Roles.HOTELMANAGER
      ? [{ name: "Khách sạn của tôi", to: "/my_hotel" }]
      : []),
    ...(user?.role === Roles.TOURGUIDE
      ? [{ name: "Quản lý lịch trình", to: "/my_schedules" }]
      : []),
  ];

  const isLoggedIn = !!user;

  if (loading) {
    return <OverlayReload />;
  }

  const onLogout = async () => {
    const res = await handleLogout();
    if (res?.success) {
      await reloadUser();
      navigate("/login");
    }
  };

  let menuItems = isLoggedIn
    ? baseMenuItems
    : [...baseMenuItems, ...authMenuItems];

  if (user?.role !== "Admin" && user?.role !== "Supervisor") {
    menuItems = menuItems.filter((item) => item.to !== "/manager");
  }

  console.log(Cookies.get("access_token"));

  return (
    <div className="flex justify-between w-full px-10 items-center fixed h-20 bg-white z-100 shadow-md">
      <Link to={"/"}>
        <img
          className="md:w-20 w-15 object-cover"
          src={assets.logo}
          alt="Logo"
        />
      </Link>

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
        {isLoggedIn && (
          <Menu as="div">
            <Menu.Button className="flex items-center space-x-2 rounded-2xl border border-blue-500 px-3 py-2 cursor-pointer">
              <img
                src={user.avatarURL || assets.logo}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-md font-semibold text-blue-500">
                {user.fullName}
              </span>
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
              <Menu.Items className="absolute right-5 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
                {settingMenuItems.map((item) => (
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
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onLogout()}
                      className={`${
                        active
                          ? "bg-blue-400 font-semibold text-white shadow-md"
                          : "hover:bg-blue-400 hover:text-white"
                      } block w-full text-left px-4 py-2 text-sm rounded-md cursor-pointer`}
                    >
                      Đăng xuất
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        )}
      </div>

      <div className="lg:hidden flex items-center mr-[-30px]">
        {isLoggedIn && (
          <Menu as="div">
            <Menu.Button className="flex items-center justify-center mx-auto cursor-pointer">
              <img
                src={user.avatarURL || assets.logo}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
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
              <Menu.Items className="absolute right-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
                {settingMenuItems.map((item) => (
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
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onLogout()}
                      className={`${
                        active
                          ? "bg-blue-400 font-semibold text-white shadow-md"
                          : "hover:bg-blue-400 hover:text-white"
                      } block w-full text-left px-4 py-2 text-sm rounded-md cursor-pointer`}
                    >
                      Đăng xuất
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        )}
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="z-30 rounded-md px-4 py-2 text-sm font-medium cursor-pointer">
            <AlignJustify className="text-black outline-0" />
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
