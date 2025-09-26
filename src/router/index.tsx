import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Hotel from "../pages/Hotel";
import Discount from "../pages/Discount";
import Tour from "../pages/Tour";
import Profile from "../pages/Profile";
import Unauthorized from "../pages/Unauthorized";
import { AuthGuard, RoleGuard } from "../components/ProtectRoute";
import { Roles } from "../constants/role";
import Contact from "../pages/Contact";
import Manager from "../pages/Manager";
import Dashboard from "../pages/Dashboard";
import CustomerManager from "../pages/CustomerManage";
import StaffManager from "../pages/StaffManage";
import HotelCreate from "../pages/HotelCreate";
import { ImageProvider } from "../contexts/ImageContext";
import HotelManage from "../pages/HotelManage";
import TourManage from "../pages/TourManage";
import { TourProvider } from "../contexts/TourContext";
import TourCreate from "../pages/TourCreate";
import TourInfo from "../pages/TourInfo";
import { HotelProvider } from "../contexts/HotelContext";
import HotelInfo from "../pages/HotelInfo";
import { RoomProvider } from "../contexts/RoomContext";
import TourEdit from "../pages/TourEdit";
import HotelEdit from "../pages/HotelEdit";
import HotelEditAll from "../pages/HotelEditAll";
import HotelRoomManage from "../pages/HotelRoomManage";
import RoomManageInfo from "../pages/RoomManageInfo";
import RoomInfo from "../pages/RoomInfo";
import VoucherManage from "../pages/VoucherManage";
import { VoucherProvider } from "../contexts/VoucherContext";
import ProfileLayout from "../layouts/ProfileLayout";
import UserVoucher from "../pages/UserVoucher";
import { BookingRoomProvider } from "../contexts/BookingRoomContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Navigate to="/home" replace /> },
      { path: "home", element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      {
        path: "hotel",
        element: (
          <HotelProvider>
            <Hotel />
          </HotelProvider>
        ),
      },
      {
        path: "tour",
        element: (
          <TourProvider>
            <Tour />
          </TourProvider>
        ),
      },
      {
        path: "/tour_info/:id",
        element: (
          <TourProvider>
            <TourInfo />
          </TourProvider>
        ),
      },
      {
        path: "/room_info/:id",
        element: (
          <RoomProvider>
            <RoomInfo />
          </RoomProvider>
        ),
      },
      {
        path: "/hotel_info/:id",
        element: (
          <HotelProvider>
            <RoomProvider>
              <HotelInfo />
            </RoomProvider>
          </HotelProvider>
        ),
      },
      {
        path: "hotel_create",
        element: (
          <ImageProvider>
            <HotelCreate />
          </ImageProvider>
        ),
      },

      {
        path: "discount",
        element: (
          <VoucherProvider>
            <Discount />
          </VoucherProvider>
        ),
      },
      { path: "unauthorized", element: <Unauthorized /> },

      {
        element: <AuthGuard />,
        children: [
          {
            element: <ProfileLayout />,
            children: [
              {
                path: "profile",
                element: <Profile />,
              },
              {
                path: "user_voucher",
                element: <UserVoucher />,
              },
            ],
          },
        ],
      },
      {
        element: <RoleGuard deniedRoles={[Roles.ADMIN]} />,
        children: [{ path: "contact", element: <Contact /> }],
      },

      {
        element: <RoleGuard allowedRoles={[Roles.HOTELMANAGER]} />,
        path: "my_hotel",
        children: [
          {
            path: "/my_hotel",
            element: <Navigate to="room_manage" replace />,
          },
          {
            path: "room_create",
            element: (
              <ImageProvider>
                <HotelProvider>
                  <RoomProvider>
                    <RoomManageInfo />
                  </RoomProvider>
                </HotelProvider>
              </ImageProvider>
            ),
          },
          {
            path: "room_edit/:id",
            element: (
              <ImageProvider>
                <HotelProvider>
                  <RoomProvider>
                    <RoomManageInfo />
                  </RoomProvider>
                </HotelProvider>
              </ImageProvider>
            ),
          },
          {
            element: (
              <HotelProvider>
                <HotelEditAll />
              </HotelProvider>
            ),
            children: [
              {
                path: "hotel_edit",
                element: (
                  <HotelProvider>
                    <ImageProvider>
                      <HotelEdit />
                    </ImageProvider>
                  </HotelProvider>
                ),
              },
              {
                path: "room_manage",
                element: (
                  <RoomProvider>
                    <HotelProvider>
                      <HotelRoomManage />
                    </HotelProvider>
                  </RoomProvider>
                ),
              },
            ],
          },
        ],
      },

      {
        element: <RoleGuard allowedRoles={[Roles.ADMIN, Roles.SUPERVISOR]} />,
        children: [
          {
            path: "manager",
            element: <Manager />,
            children: [
              {
                index: true,
                element: <Navigate to="dashboard" replace />,
              },
              { path: "dashboard", element: <Dashboard /> },
              { path: "customer", element: <CustomerManager /> },
              { path: "staff", element: <StaffManager /> },
              {
                path: "voucher",
                element: (
                  <VoucherProvider>
                    <VoucherManage />
                  </VoucherProvider>
                ),
              },
              {
                path: "hotel",
                element: (
                  <HotelProvider>
                    <HotelManage />
                  </HotelProvider>
                ),
              },
              {
                path: "tour",
                element: (
                  <TourProvider>
                    <TourManage />
                  </TourProvider>
                ),
              },
              {
                path: "tour_create",
                element: (
                  <ImageProvider>
                    <TourProvider>
                      <TourCreate />
                    </TourProvider>
                  </ImageProvider>
                ),
              },
              {
                path: "tour_edit/:id",
                element: (
                  <ImageProvider>
                    <TourProvider>
                      <ImageProvider>
                        <TourEdit />
                      </ImageProvider>
                    </TourProvider>
                  </ImageProvider>
                ),
              },
              {
                element: (
                  <HotelProvider>
                    <HotelEditAll />
                  </HotelProvider>
                ),
                children: [
                  {
                    path: "hotel_edit/:id",
                    element: (
                      <HotelProvider>
                        <ImageProvider>
                          <HotelEdit />
                        </ImageProvider>
                      </HotelProvider>
                    ),
                  },
                  {
                    path: "room_manage/:id",
                    element: (
                      <HotelProvider>
                        <RoomProvider>
                          <HotelRoomManage />
                        </RoomProvider>
                      </HotelProvider>
                    ),
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);
export default router;
