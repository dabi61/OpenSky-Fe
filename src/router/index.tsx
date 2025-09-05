import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/Login";
import Register from "../pages/Regiser";
import Home from "../pages/Home";
import Hotel from "../pages/Hotel";
import Discount from "../pages/Discount";
import Tour from "../pages/Tour";
import Profile from "../pages/Profile";

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
      { path: "profile", element: <Profile /> },
    ],
  },
]);
export default router;
