import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Hotel,
  MapPin,
  CreditCard,
  TrendingUp,
  DollarSign,
  UserCheck,
  UserCog,
  User,
  Building,
  Globe,
} from "lucide-react";
import type {
  BillStatisticResponse,
  UserStatisticResponse,
  ServiceStatisticResponse,
} from "../types/response/statistic.type";
import type { Roles } from "../constants/role";
import {
  getBIllStatistics,
  getServiceStatistics,
  getUserStatistics,
} from "../api/statistic.api";

const Dashboard: React.FC = () => {
  const [billStatistic, setBillStatistic] =
    useState<BillStatisticResponse | null>(null);
  const [userTourGuideStatistic, setUserTourGuideStatistic] =
    useState<UserStatisticResponse | null>(null);
  const [userSupervisorStatistic, setUserSupervisorStatistic] =
    useState<UserStatisticResponse | null>(null);
  const [userCustomerStatistic, setUserCustomerStatistic] =
    useState<UserStatisticResponse | null>(null);
  const [hotelStatistic, setHotelStatistic] =
    useState<ServiceStatisticResponse | null>(null);
  const [tourStatistic, setTourStatistic] =
    useState<ServiceStatisticResponse | null>(null);

  useEffect(() => {
    const fetchBillStatistics = async () => {
      try {
        const res = await getBIllStatistics();
        console.log("Bill statistics:", res);
        setBillStatistic(res);
      } catch (err) {
        console.error("Lỗi khi lấy bill statistics:", err);
      }
    };
    fetchBillStatistics();
  }, []);

  useEffect(() => {
    const fetchUserStatistics = async () => {
      try {
        const [tourGuideRes, supervisorRes, customerRes] = await Promise.all([
          getUserStatistics("TourGuide" as Roles),
          getUserStatistics("Supervisor" as Roles),
          getUserStatistics("Customer" as Roles),
        ]);

        console.log("TourGuide statistics:", tourGuideRes);
        console.log("Supervisor statistics:", supervisorRes);
        console.log("Customer statistics:", customerRes);

        setUserTourGuideStatistic(tourGuideRes);
        setUserSupervisorStatistic(supervisorRes);
        setUserCustomerStatistic(customerRes);
      } catch (err) {
        console.error("Lỗi khi lấy user statistics:", err);
      }
    };
    fetchUserStatistics();
  }, []);

  useEffect(() => {
    const fetchServiceStatistics = async () => {
      try {
        const [hotelRes, tourRes] = await Promise.all([
          getServiceStatistics("Hotel"),
          getServiceStatistics("Tour"),
        ]);

        console.log("Hotel service statistics:", hotelRes);
        console.log("Tour service statistics:", tourRes);

        setHotelStatistic(hotelRes);
        setTourStatistic(tourRes);
      } catch (err) {
        console.error("Lỗi khi lấy service statistics:", err);
      }
    };
    fetchServiceStatistics();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const billChartData =
    billStatistic?.monthlyData?.map((item) => ({
      name: `Tháng ${item.month}`,
      doanhThu: item.totoalAmount,
      soHoaDon: item.billCount,
    })) || [];

  const totalRevenue =
    billStatistic?.monthlyData?.reduce(
      (sum, item) => sum + item.totoalAmount,
      0
    ) || 0;
  const totalBills =
    billStatistic?.monthlyData?.reduce(
      (sum, item) => sum + item.billCount,
      0
    ) || 0;
  const totalUsers =
    (userCustomerStatistic?.count || 0) +
    (userTourGuideStatistic?.count || 0) +
    (userSupervisorStatistic?.count || 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Tổng doanh thu
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>Tăng trưởng</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng hóa đơn</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {totalBills}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Tổng người dùng
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {totalUsers}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Dịch vụ</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {(hotelStatistic?.count || 0) + (tourStatistic?.count || 0)}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Hotel className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Doanh thu theo tháng
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={billChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                tickFormatter={(value) =>
                  formatCurrency(value).replace("₫", "")
                }
              />
              <Tooltip
                formatter={(value: number) => [
                  formatCurrency(value),
                  "Doanh thu",
                ]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="doanhThu"
                stroke="#0088FE"
                strokeWidth={2}
                name="Doanh thu"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Số hóa đơn theo tháng
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={billChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="soHoaDon"
                fill="#00C49F"
                name="Số hóa đơn"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Thống kê người dùng
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <User className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Khách hàng</p>
                  <p className="text-sm text-gray-600">Người dùng hệ thống</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-blue-600">
                {userCustomerStatistic?.count || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <UserCheck className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Hướng dẫn viên</p>
                  <p className="text-sm text-gray-600">Quản lý tour du lịch</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-green-600">
                {userTourGuideStatistic?.count || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <UserCog className="w-5 h-5 text-yellow-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Giám sát viên</p>
                  <p className="text-sm text-gray-600">Quản lý hệ thống</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-yellow-600">
                {userSupervisorStatistic?.count || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Thống kê dịch vụ
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
              <div className="flex items-center">
                <Building className="w-5 h-5 text-indigo-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Khách sạn</p>
                  <p className="text-sm text-gray-600">Dịch vụ lưu trú</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-indigo-600 block">
                  {hotelStatistic?.count || 0}
                </span>
                <span className="text-sm text-gray-500">
                  Tháng {hotelStatistic?.month}/{hotelStatistic?.year}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-teal-50 rounded-lg">
              <div className="flex items-center">
                <Globe className="w-5 h-5 text-teal-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Tour du lịch</p>
                  <p className="text-sm text-gray-600">Tour và hoạt động</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-teal-600 block">
                  {tourStatistic?.count || 0}
                </span>
                <span className="text-sm text-gray-500">
                  Tháng {tourStatistic?.month}/{tourStatistic?.year}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Tổng dịch vụ</p>
                  <p className="text-sm text-gray-600">Tất cả dịch vụ</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-gray-600">
                {(hotelStatistic?.count || 0) + (tourStatistic?.count || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
