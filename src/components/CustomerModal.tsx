import type React from "react";
import Modal from "./Modal";
import { Button, TextField, CircularProgress } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { CalendarPlus, Camera, Mail, User } from "lucide-react";
import {
  UserCreateSchema,
  UserSchema,
  type UserCreateType,
  type UserCreateValidateType,
  type UserUpdateType,
  type UserValidateType,
} from "../types/schemas/profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { Roles } from "../constants/role";
import { useUser } from "../contexts/UserContext";
import type { UserType } from "../types/response/user.type";
import { toast } from "sonner";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: UserType | null;
}

const CustomerModal: React.FC<ModalProps> = ({ isOpen, onClose, data }) => {
  const isUpdate = Boolean(data?.userID);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<UserCreateValidateType | UserValidateType>({
    resolver: zodResolver(isUpdate ? UserSchema : UserCreateSchema),
    mode: "onBlur",
    defaultValues: {
      fullname: data?.fullName ?? "",
      ...(isUpdate ? {} : { new_email: data?.email ?? "", new_password: "" }),
      phoneNumber: data?.phoneNumber ?? "",
      dob: data?.dob ? dayjs(data.dob).toDate() : null,
      citizenId: data?.citizenId ?? "",
    },
  });

  const { createUser, updateUser } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data) {
      reset({
        fullname: data.fullName ?? "",
        new_email: data.email ?? "",
        phoneNumber: data.phoneNumber ?? "",
        dob: data.dob ? dayjs(data.dob).toDate() : null,
        citizenId: data.citizenId ?? "",
      });

      if (data.avatarURL) {
        setAvatarPreview(data.avatarURL);
      }
    } else {
      reset({
        fullname: "",
        new_email: "",
        phoneNumber: "",
        dob: null,
        citizenId: "",
      });
      setAvatarPreview(null);
    }
  }, [data, reset]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh");
      return;
    }

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

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const onCreateSubmit = async (formData: UserCreateValidateType) => {
    setIsSubmitting(true);
    try {
      const submitData: UserCreateType = {
        dob: formData.dob ?? null,
        role: Roles.CUSTOMER,
        citizenId: formData.citizenId ?? null,
        phoneNumber: formData.phoneNumber ?? null,
        ...formData,
      };

      if (avatarFile) {
        submitData.avatar = avatarFile;
      }
      await createUser(submitData);
    } catch (error) {
      console.error("Failed to save customer:", error);
      toast.error("Có lỗi xảy ra khi thêm khách hàng");
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  const onUpdateSubmit = async (formData: UserValidateType) => {
    if (!data?.userID) return;

    setIsSubmitting(true);
    try {
      const submitData: Partial<UserUpdateType> = {
        fullname: formData?.fullname || "",
        phoneNumber: formData?.phoneNumber || "",
        citizenId: formData?.citizenId || "",
        dob: formData?.dob || undefined,
      };
      console.log(submitData);

      if (avatarFile) {
        submitData.avatar = avatarFile;
      }

      await updateUser(data.userID, submitData);
    } catch (error) {
      console.error("Failed to save customer:", error);
      toast.error("Có lỗi xảy ra khi cập nhật khách hàng");
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  const onSubmit = (formData: UserCreateValidateType | UserValidateType) => {
    if (isUpdate) {
      onUpdateSubmit(formData as UserValidateType);
    } else {
      onCreateSubmit(formData as UserCreateValidateType);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isUpdate ? "Cập nhật khách hàng" : "Thêm khách hàng"}
      reset={() => {
        setAvatarPreview(null);
        setAvatarFile(null);
        setIsSubmitting(false);
      }}
    >
      <form className="space-y-4 mt-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center">
          <div className="relative group mb-2">
            <div
              className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors relative"
              onClick={handleAvatarClick}
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={40} className="text-gray-400" />
              )}

              {isUploading && (
                <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center">
                  <CircularProgress size={24} sx={{ color: "white" }} />
                </div>
              )}
            </div>

            <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-700 transition-colors">
              <Camera size={16} />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleAvatarChange}
              />
            </label>
          </div>
        </div>

        {data && data.email && (
          <div className="flex gap-2 mx-auto justify-evenly text-gray-600 bg-gray-100 py-2 rounded-md w-full">
            <div className="flex gap-2">
              <Mail /> <div>{data.email}</div>
            </div>
            <div className="flex gap-2">
              <CalendarPlus />
              <div>{dayjs(data.createdAt).format("DD-MM-YYYY")}</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          <div className="space-y-8 flex flex-col gap-2">
            <TextField
              fullWidth
              label="Họ và tên *"
              variant="outlined"
              {...register("fullname")}
              error={!!errors.fullname}
              helperText={errors.fullname?.message ?? " "}
            />

            {!isUpdate && (
              <TextField
                fullWidth
                type="email"
                label="Email *"
                variant="outlined"
                autoComplete="off"
                {...register("new_email" as keyof UserCreateValidateType)}
                error={!!(errors as any).new_email}
                helperText={(errors as any).new_email?.message ?? " "}
              />
            )}

            <TextField
              fullWidth
              label="CCCD/CMND"
              variant="outlined"
              {...register("citizenId")}
              error={!!errors.citizenId}
              helperText={errors.citizenId?.message ?? " "}
            />
          </div>

          <div className="space-y-4 flex flex-col gap-2">
            {!isUpdate && (
              <TextField
                fullWidth
                type="password"
                label="Mật khẩu *"
                autoComplete="off"
                variant="outlined"
                {...register("new_password" as keyof UserCreateValidateType)}
                error={!!(errors as any).new_password}
                helperText={(errors as any).new_password?.message ?? " "}
              />
            )}

            <TextField
              fullWidth
              type="tel"
              label="Số điện thoại"
              variant="outlined"
              {...register("phoneNumber")}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message ?? " "}
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
                        error: !!errors.dob,
                        helperText: errors.dob?.message ?? " ",
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outlined"
            fullWidth
            onClick={onClose}
            disabled={isSubmitting}
            sx={{
              py: 1.5,
              borderColor: "gray.300",
              color: "gray.700",
              "&:hover": {
                borderColor: "gray.400",
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
              "&.Mui-disabled": {
                borderColor: "rgba(0, 0, 0, 0.12)",
                color: "rgba(0, 0, 0, 0.26)",
              },
            }}
          >
            Hủy
          </Button>

          <Button
            variant="contained"
            type="submit"
            fullWidth
            disabled={isSubmitting || isUploading}
            sx={{
              py: 1.5,
              "&.Mui-disabled": {
                backgroundColor: "rgba(0, 0, 0, 0.12)",
                color: "rgba(0, 0, 0, 0.26)",
              },
            }}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1, color: "inherit" }} />
                {isUpdate ? "Đang cập nhật..." : "Đang thêm..."}
              </>
            ) : isUpdate ? (
              "Cập nhật khách hàng"
            ) : (
              "Thêm khách hàng"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CustomerModal;
