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
import Booking from "../pages/Booking";
import { ScheduleProvider } from "../contexts/ScheduleContext";
import Bill from "../pages/Bill";
import { BookingProvider } from "../contexts/BookingContext";
import { BillProvider } from "../contexts/BillContext";
import BillManage from "../pages/BillManage";
import MyBill from "../pages/MyBill";
import ScheduleManage from "../pages/ScheduleManage";
import { ScheduleItineraryProvider } from "../contexts/ScheduleItineraryContext";
import ScheduleItinerary from "../pages/ScheduleItinerary";
import MySchedule from "../pages/MySchedule";
import { FeedbackProvider } from "../contexts/FeedbackContext";
import { RefundProvider } from "../contexts/RefundContext";
import RefundManage from "../pages/RefundManage";
import RefundInfo from "../pages/RefundInfo";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Navigate to="/home" replace /> },
      {
        path: "home",
        element: (
          <TourProvider>
            <HotelProvider>
              <VoucherProvider>
                <Home />
              </VoucherProvider>
            </HotelProvider>
          </TourProvider>
        ),
      },
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
            <BookingProvider>
              <Tour />
            </BookingProvider>
          </TourProvider>
        ),
      },
      {
        path: "/tour_info/:id",
        element: (
          <TourProvider>
            <BookingProvider>
              <ScheduleProvider>
                <FeedbackProvider>
                  <TourInfo />
                </FeedbackProvider>
              </ScheduleProvider>
            </BookingProvider>
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
              <FeedbackProvider>
                <HotelInfo />
              </FeedbackProvider>
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
            path: "bill/:id",
            element: (
              <BillProvider>
                <RefundProvider>
                  <Bill />
                </RefundProvider>
              </BillProvider>
            ),
          },
          {
            path: "schedule_itinerary/:id",
            element: (
              <ScheduleProvider>
                <ScheduleItineraryProvider>
                  <ScheduleItinerary />
                </ScheduleItineraryProvider>
              </ScheduleProvider>
            ),
          },
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
              {
                path: "my_bills",
                element: (
                  <BillProvider>
                    <MyBill />
                  </BillProvider>
                ),
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
        element: (
          <RoleGuard allowedRoles={[Roles.HOTELMANAGER, Roles.CUSTOMER]} />
        ),
        children: [
          {
            path: "booking",
            element: (
              <BookingProvider>
                <Booking />
              </BookingProvider>
            ),
          },
        ],
      },

      {
        element: <RoleGuard allowedRoles={[Roles.TOURGUIDE]} />,
        children: [
          {
            path: "my_schedules",
            element: (
              <ScheduleProvider>
                <MySchedule />
              </ScheduleProvider>
            ),
          },
        ],
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
                path: "bill",
                element: (
                  <BillProvider>
                    <BillManage />
                  </BillProvider>
                ),
              },
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
                path: "schedule",
                element: (
                  <ScheduleProvider>
                    <ScheduleManage />
                  </ScheduleProvider>
                ),
              },
              {
                path: "refund",
                element: (
                  <RefundProvider>
                    <RefundManage />
                  </RefundProvider>
                ),
              },
              {
                path: "refund_info/:id",
                element: (
                  <RefundProvider>
                    <BillProvider>
                      <RefundInfo />
                    </BillProvider>
                  </RefundProvider>
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
                      <ScheduleProvider>
                        <ImageProvider>
                          <TourEdit />
                        </ImageProvider>
                      </ScheduleProvider>
                    </TourProvider>
                  </ImageProvider>
                ),
              },
              {
                path: "refund/:id",
                element: (
                  <ImageProvider>
                    <TourProvider>
                      <ScheduleProvider>
                        <RefundInfo />
                      </ScheduleProvider>
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
