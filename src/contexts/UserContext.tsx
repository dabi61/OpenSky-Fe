import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import {
  handleCreateUser,
  handleGetUser,
  handleGetUserByRole,
  handleSearchUserByRole,
  handleUpdateCurrentUser,
  handleUpdateUser,
} from "../api/user.api";
import type { UserPage, UserType } from "../types/response/user.type";
import Cookies from "js-cookie";
import type {
  UserCreateType,
  UserUpdateType,
} from "../types/schemas/profile.schema";
import { toast } from "sonner";
import { Roles } from "../constants/role";

type UserContextType = {
  userList: UserType[];
  user: UserType | null;
  loading: boolean;
  getUsersByRole: (
    role: Roles[],
    page: number,
    size: number
  ) => Promise<UserPage>;
  searchUsersByRole: (
    keyword: string,
    roles: Roles[],
    page: number,
    size: number
  ) => Promise<UserPage>;
  reloadUser: () => Promise<UserType | null>;
  updateUser: (id: string, data: Partial<UserUpdateType>) => Promise<void>;
  updateCurrentUser: (data: Partial<UserUpdateType>) => Promise<void>;
  createUser: (data: Partial<UserCreateType>) => Promise<void>;
  addUserToList: (user: UserType) => void;
  updateUserInList: (id: string, updatedUser: UserType) => void;
  removeUserFromList: (id: string) => void;
  refreshUsers: () => Promise<void>;
  keyword: string;
  setKeyword: Dispatch<SetStateAction<string>>;
};

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const initialUser = Cookies.get("refresh_token") ? undefined : null;
  const [userList, setUserList] = useState<UserType[]>([]);
  const [user, setUser] = useState<UserType | null | undefined>(initialUser);
  const [loading, setLoading] = useState(!!Cookies.get("refresh_token"));
  const [keyword, setKeyword] = useState<string>("");

  const addUserToList = (newUser: UserType) => {
    setUserList((prev) => [...prev, newUser]);
  };

  const updateUserInList = (id: string, updatedUser: UserType) => {
    setUserList((prev) =>
      prev.map((user) =>
        user.userID === id ? { ...user, ...updatedUser } : user
      )
    );
  };

  const removeUserFromList = (id: string) => {
    setUserList((prev) => prev.filter((user) => user.userID !== id));
  };

  const refreshUsers = async () => {
    try {
    } catch (error) {
      console.error("Failed to refresh users:", error);
    }
  };

  const reloadUser = async (): Promise<UserType | null> => {
    try {
      setLoading(true);
      const refresh_token = Cookies.get("refresh_token");
      if (!refresh_token) {
        setUser(null);
        return null;
      }
      const data = await handleGetUser();
      setUser(data);
      return data;
    } catch (error) {
      console.error("Lỗi lấy user:", error);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCurrentUser = async (data: Partial<UserUpdateType>) => {
    const res = await handleUpdateCurrentUser(data);
    if (Object.keys(res.profile).length > 0) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  const updateUser = async (id: string, data: Partial<UserUpdateType>) => {
    const res = await handleUpdateUser(id, data);
    console.log(res);
    if (Object.keys(res.user).length > 0) {
      toast.success(res.message);
      updateUserInList(id, res.user);
      setKeyword("");
    } else {
      toast.error(res.message);
    }
  };

  const searchUsersByRole = async (
    keyword: string,
    roles: Roles[],
    page: number,
    size: number
  ): Promise<UserPage> => {
    const res = await handleSearchUserByRole(keyword, roles, page, size);
    setUserList(res.users);
    return res;
  };

  const createUser = async (data: Partial<UserCreateType>) => {
    const validData = data as UserCreateType;
    const res = await handleCreateUser(validData);
    if ("userID" in res) {
      toast.success("Tạo thành công!");
      addUserToList(res);
      setKeyword("");
    } else {
      toast.error(res.message);
    }
  };

  const getUsersByRole = async (
    roles: Roles[],
    page: number,
    size: number
  ): Promise<UserPage> => {
    const res = await handleGetUserByRole(roles, page, size);
    setUserList(res.users);
    return res;
  };

  useEffect(() => {
    if (Cookies.get("refresh_token")) {
      reloadUser();
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        user: user || null,
        userList,
        loading,
        reloadUser,
        updateUser,
        updateCurrentUser,
        createUser,
        getUsersByRole,
        searchUsersByRole,
        addUserToList,
        updateUserInList,
        removeUserFromList,
        refreshUsers,
        keyword,
        setKeyword,
      }}
    >
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
