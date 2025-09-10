import React from "react";
import BottomNavigation from "../components/BottomNavigation";
import { Outlet } from "react-router-dom";

const Manager: React.FC = () => {
  return (
    <div>
      <Outlet />
      <BottomNavigation />
    </div>
  );
};

export default Manager;
