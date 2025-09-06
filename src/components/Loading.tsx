import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import assets from "../assets";

const OverlayReload = () => {
  const { loading } = useUser();
  const [showOverlay, setShowOverlay] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!loading) {
      setIsExiting(true);
      const timer = setTimeout(() => {
        setShowOverlay(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (!showOverlay) return null;

  return (
    <div
      className={`
        fixed inset-0 bg-white z-[1000] 
        flex items-center justify-center
        transition-opacity duration-500 ease-in-out
        ${isExiting ? "opacity-0" : "opacity-100"}
      `}
    >
      <div className="text-center">
        <div className="relative">
          <img
            src={assets.logo}
            alt="Logo"
            className="w-20 h-20 mx-auto mb-4 animate-pulse"
          />

          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-gray-600 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    </div>
  );
};

export default OverlayReload;
