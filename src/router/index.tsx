import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/Login";
import Register from "../pages/Regiser";
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Navigate to="/home" replace /> },
      { path: "home", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "hotel", element: <Hotel /> },
      { path: "tour", element: <Tour /> },
      { path: "discount", element: <Discount /> },
      { path: "unauthorized", element: <Unauthorized /> },
      {
        element: <AuthGuard />,
        children: [{ path: "profile", element: <Profile /> }],
      },
      {
        element: <RoleGuard deniedRoles={[Roles.ADMIN]} />,
        children: [{ path: "contact", element: <Contact /> }],
      },
      {
        element: <RoleGuard allowedRoles={[Roles.ADMIN, Roles.SUPERVISOR]} />,
        children: [
          {
            path: "/manager",
            element: <Manager />,
            children: [
              {
                path: "/manager",
                element: <Navigate to="dashboard" replace />,
              },
              {
                path: "dashboard",
                element: <Dashboard />,
              },
              {
                path: "customer",
                element: <CustomerManager />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
export default router;
