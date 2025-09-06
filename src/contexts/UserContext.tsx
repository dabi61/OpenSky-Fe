import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { handleGetUser } from "../api/user";
import type { UserType } from "../types/response/user";
import Cookies from "js-cookie";

type UserContextType = {
  user: UserType | null;
  loading: boolean;
  reloadUser: () => Promise<void>;
};

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const initialUser = Cookies.get("refresh_token") ? undefined : null;
  const [user, setUser] = useState<UserType | null | undefined>(initialUser);
  const [loading, setLoading] = useState(!!Cookies.get("refresh_token"));

  const reloadUser = async () => {
    try {
      setLoading(true);
      const refresh_token = Cookies.get("refresh_token");
      console.log(refresh_token);

      if (!refresh_token) {
        setUser(null);
        return;
      }
      const data = await handleGetUser();
      setUser(data);
    } catch (error) {
      console.error("Lỗi lấy user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Cookies.get("refresh_token")) {
      reloadUser();
    }
  }, []);

  return (
    <UserContext.Provider value={{ user: user || null, loading, reloadUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within an UserProvider");
  }
  return context;
};
