import Footer from "../components/Footer";
import Header from "../components/Header";
import { Outlet, useLocation } from "react-router-dom";

function MainLayout() {
  const location = useLocation();
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <header>
        <Header />
      </header>
      <main className="flex-1 flex flex-col mt-20">
        <div className="flex-1 flex flex-col">
          <Outlet />
        </div>
      </main>
      {location.pathname !== "/login" &&
        location.pathname !== "/register" &&
        !location.pathname.includes("/my_hotel") &&
        !location.pathname.includes("/room_info") &&
        !location.pathname.includes("/manager") && (
          <footer>
            <Footer />
          </footer>
        )}
    </div>
  );
}

export default MainLayout;
