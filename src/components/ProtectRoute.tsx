import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import OverlayReload from "./Loading";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  deniedRoles?: string[];
}

export function RoleGuard({ allowedRoles, deniedRoles }: ProtectedRouteProps) {
  const { user, loading } = useUser();

  if (loading) return <OverlayReload />;

  if (allowedRoles && !allowedRoles.includes(user?.role ?? "")) {
    return <Navigate to={"/unauthorized"} replace />;
  }
  if (deniedRoles && deniedRoles.includes(user?.role ?? "")) {
    return <Navigate to={"/unauthorized"} replace />;
  }

  return <Outlet />;
}

export function AuthGuard() {
  const { user, loading } = useUser();

  if (loading) return <OverlayReload />;

  if (!user) {
    return <Navigate to={"/unauthorized"} replace />;
  }
  return <Outlet />;
}
