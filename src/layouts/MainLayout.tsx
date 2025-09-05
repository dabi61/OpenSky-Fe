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
      {location.pathname !== "/login" && location.pathname !== "/register" && (
        <footer>
          <Footer />
        </footer>
      )}
    </div>
  );
}

export default MainLayout;
