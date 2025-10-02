import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router/index.tsx";
import { Toaster } from "sonner";
import { UserProvider } from "./contexts/UserContext.tsx";
import { BookingProvider } from "./contexts/BookingContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <BookingProvider>
        <RouterProvider router={router} />
        <Toaster position="top-center" richColors />
      </BookingProvider>
    </UserProvider>
  </StrictMode>
);
