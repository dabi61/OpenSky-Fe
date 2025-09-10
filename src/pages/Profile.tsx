import { Button, TextField, CircularProgress } from "@mui/material";
import Sidebar from "../components/Sidebar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import { useUser } from "../contexts/UserContext";
import assets from "../assets";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CloudUpload, Edit } from "lucide-react";
import {
  UserSchema,
  type UserUpdateType,
  type UserValidateType,
} from "../types/schemas/profile.schema";

const Profile: React.FC = () => {
  const { user, updateCurrentUser } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<UserValidateType>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      fullname: user?.fullName || "",
      phoneNumber: user?.phoneNumber || "",
      citizenId: user?.citizenId || "",
      dob: user?.dob ? dayjs(user.dob).toDate() : null,
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (user) {
      reset({
        fullname: user.fullName,
        phoneNumber: user.phoneNumber,
        citizenId: user.citizenId || "",
        dob: user.dob ? dayjs(user.dob).toDate() : null,
      });
    }
  }, [user, reset]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
      setAvatarFile(file);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
    }, 1500);
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: UserValidateType) => {
    setIsSubmitting(true);
    try {
      const updateData: Partial<UserUpdateType> = {
        fullname: data.fullname,
        phoneNumber: data.phoneNumber,
        citizenId: data.citizenId,
        dob: data.dob ? data.dob : null,
      };

      if (avatarFile) {
        updateData.avatar = avatarFile;
      }

      await updateCurrentUser(updateData);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex justify-center gap-5 p-6">
      <Sidebar />
      <form
        className="max-w-2xl bg-white rounded-lg shadow-md p-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div
              className="rounded-full w-40 h-40 mx-auto mb-4 overflow-hidden cursor-pointer group relative"
              onClick={handleAvatarClick}
            >
              <img
                src={avatarPreview || user.avatarURL || assets.logo}
                className="w-full h-full object-cover"
                alt="Avatar"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Edit className="text-white" />
              </div>
            </div>

            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <CircularProgress size={40} />
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="flex gap-2 mt-2">
            <Button
              variant="outlined"
              size="small"
              onClick={handleAvatarClick}
              startIcon={<CloudUpload />}
            >
              Change Avatar
            </Button>
            {(avatarPreview || user.avatarURL) && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={removeAvatar}
              >
                Remove
              </Button>
            )}
          </div>

          <h2 className="text-xl font-semibold mt-4">{user.email}</h2>
        </div>

        <div className="space-y-4 w-full">
          <TextField
            label="Họ tên"
            fullWidth
            size="medium"
            margin="normal"
            {...register("fullname")}
            error={!!errors.fullname}
            helperText={errors.fullname?.message}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="Số điện thoại"
            fullWidth
            size="medium"
            margin="normal"
            {...register("phoneNumber")}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber?.message}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="CCCD"
            fullWidth
            size="medium"
            margin="normal"
            {...register("citizenId")}
            error={!!errors.citizenId}
            helperText={errors.citizenId?.message}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="dob"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Ngày sinh"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) =>
                    field.onChange(date ? date.toDate() : null)
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "medium",
                      margin: "normal",
                      InputLabelProps: { shrink: true },
                      error: !!errors.dob,
                      helperText: errors.dob?.message,
                    },
                  }}
                />
              )}
            />
          </LocalizationProvider>
        </div>

        <div className="mt-6">
          <Button
            variant="contained"
            type="submit"
            fullWidth
            size="large"
            disabled={isSubmitting}
            sx={{
              backgroundColor: "#3B82F6",
              borderRadius: "10px",
              "&:hover": {
                backgroundColor: "#2563EB",
              },
              "&.Mui-disabled": {
                backgroundColor: "#93C5FD",
                color: "white",
              },
            }}
          >
            {isSubmitting ? "Đang cập nhật..." : "Cập nhật thông tin"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
