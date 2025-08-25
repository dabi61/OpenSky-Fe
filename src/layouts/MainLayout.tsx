import Header from "../components/Header";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Header />
      </header>
      <main className="flex-1 bg-red-300 flex flex-col ">
        <div className="flex-1 flex flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default MainLayout;
