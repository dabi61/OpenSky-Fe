import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router/index.tsx";
import { Toaster } from "sonner";
import { UserProvider } from "./contexts/UserContext.tsx";
import { BookingRoomProvider } from "./contexts/BookingRoomContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <BookingRoomProvider>
        <RouterProvider router={router} />
        <Toaster position="top-center" richColors />
      </BookingRoomProvider>
    </UserProvider>
  </StrictMode>
);
