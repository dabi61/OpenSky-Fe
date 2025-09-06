import { Button, TextField } from "@mui/material";
import Sidebar from "../components/Sidebar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useUser } from "../contexts/UserContext";
import type { UserType } from "../types/response/user";
import assets from "../assets";

const currentUser = {
  name: "Nguyễn Việt Tùng",
  avatar:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLjeSzoAS94hdtj3-nX6n95xRmtlSKhJEf8g&s",
  phone: "0123456789",
  birthDate: dayjs("1990-01-01"),
};

const Profile: React.FC = () => {
  const { user } = useUser();
  const [userData, setUserData] = useState<UserType | null>(user || null);
  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);
  if (!userData) {
    return null;
  }
  const handleDateChange = (newValue: Dayjs) => {
    setUserData({ ...userData, doB: newValue });
  };

  return (
    <div className="flex justify-center gap-5 p-6">
      <Sidebar />
      <div className="max-w-2xl bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center mb-6">
          <img
            src={userData.avatarURL || assets.logo}
            className="rounded-full w-40 h-40 object-cover mx-auto mb-4"
            alt="Avatar"
          />
          <h2 className="text-xl font-semibold">{userData.fullName}</h2>
        </div>

        <div className="space-y-4 w-full">
          <TextField
            label="Họ tên"
            fullWidth
            size="medium"
            margin="normal"
            value={userData.fullName}
            onChange={(e) =>
              setUserData({ ...userData, fullName: e.target.value })
            }
          />

          <TextField
            label="Số điện thoại"
            fullWidth
            size="medium"
            margin="normal"
            value={userData.phoneNumber}
            onChange={(e) =>
              setUserData({ ...userData, phoneNumber: e.target.value })
            }
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Ngày sinh"
              value={dayjs(userData.doB)}
              // onChange={handleDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "medium",
                  margin: "normal",
                },
              }}
            />
          </LocalizationProvider>
        </div>

        <div className="mt-2">
          <Button
            variant="contained"
            type="submit"
            fullWidth
            size="large"
            sx={{
              backgroundColor: "#3B82F6",
              borderRadius: "10px",
              "&:hover": {
                backgroundColor: "#2563EB",
              },
            }}
          >
            Cập nhật thông tin
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
