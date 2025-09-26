import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function ProfileLayout() {
  return (
    <div className="flex min-h-screen overflow-x-hidden mx-auto">
      <div className="flex flex-col md:flex-row md:justify-center md:gap-5 gap-2 md:p-6 p-2">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
}

export default ProfileLayout;
