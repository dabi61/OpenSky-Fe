import type React from "react";
import type { UserType } from "../types/response/user.type";
import Modal from "./Modal";
import {
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { CalendarPlus, Camera, Mail, User } from "lucide-react";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  StaffCreateSchema,
  StaffUpdateSchema,
  type StaffCreateType,
  type StaffUpdateType,
} from "../types/schemas/staff.schema";
import { useUser } from "../contexts/UserContext";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Roles } from "../constants/role";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: UserType | null;
}

const StaffModal: React.FC<ModalProps> = ({ isOpen, onClose, data }) => {
  const isUpdate = Boolean(data?.userID);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
  } = useForm<StaffUpdateType | StaffCreateType>({
    resolver: zodResolver(isUpdate ? StaffUpdateSchema : StaffCreateSchema),
    mode: "onBlur",
    defaultValues: {
      fullname: data?.fullName,
      ...(isUpdate
        ? {}
        : { staff_email: data?.email ?? "", staff_password: "" }),
      phoneNumber: data?.phoneNumber,
      dob: data?.dob ? dayjs(data.dob).toDate() : undefined,
      citizenId: data?.citizenId ?? "",
      role: data?.role,
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
        phoneNumber: data.phoneNumber ?? "",
        dob: data.dob ? dayjs(data.dob).toDate() : null,
        citizenId: data.citizenId ?? "",
        role: data.role ?? Roles.TOURGUIDE,
      });

      if (data.avatarURL) {
        setAvatarPreview(data.avatarURL);
      }
    } else {
      reset({
        fullname: "",
        staff_email: "",
        staff_password: "",
        phoneNumber: "",
        dob: null,
        citizenId: "",
        role: Roles.TOURGUIDE,
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
      setValue("avatar", file, { shouldValidate: true });
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

  const onCreateSubmit = async (formData: StaffCreateType) => {
    setIsSubmitting(true);
    try {
      const submitData: StaffCreateType = {
        ...formData,
        dob: formData.dob,
        role: formData.role,
        citizenId: formData.citizenId,
        phoneNumber: formData.phoneNumber,
      };

      if (avatarFile) {
        submitData.avatar = avatarFile;
      }

      await createUser(submitData);
    } catch (error) {
      console.error("Failed to save staff:", error);
      toast.error("Có lỗi xảy ra khi thêm nhân viên");
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  const onUpdateSubmit = async (formData: StaffUpdateType) => {
    if (!data?.userID) return;

    setIsSubmitting(true);
    try {
      const submitData: Partial<StaffUpdateType> = {
        fullname: formData.fullname,
        phoneNumber: formData.phoneNumber,
        citizenId: formData.citizenId,
        dob: formData.dob ?? null,
        role: formData.role,
      };

      if (avatarFile) {
        submitData.avatar = avatarFile;
      }

      await updateUser(data.userID, submitData);
    } catch (error) {
      console.error("Failed to update staff:", error);
      toast.error("Có lỗi xảy ra khi cập nhật nhân viên");
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  const onSubmit = (formData: StaffCreateType | StaffUpdateType) => {
    if (isUpdate) {
      onUpdateSubmit(formData as StaffUpdateType);
    } else {
      onCreateSubmit(formData as StaffCreateType);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isUpdate ? "Cập nhật nhân viên" : "Thêm nhân viên"}
      reset={() => {
        reset();
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
          {errors.avatar?.message && (
            <div className="text-red-600 text-[12px]">
              {errors.avatar.message}
            </div>
          )}
        </div>

        {data && data.email && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-gray-600 bg-gray-100 p-3 rounded-md">
            <div className="flex items-center gap-2 text-sm">
              <Mail size={16} />
              <span>{data.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CalendarPlus size={16} />
              <span>{dayjs(data.createdAt).format("DD/MM/YYYY")}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cột trái */}
          <div className="flex flex-col gap-4">
            <TextField
              fullWidth
              label="Họ và tên *"
              variant="outlined"
              autoComplete="off"
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
                autoComplete="new-email"
                {...register("staff_email")}
                error={!!errors.staff_email}
                helperText={errors.staff_email?.message ?? " "}
              />
            )}

            <TextField
              fullWidth
              label="CCCD/CMND *"
              variant="outlined"
              {...register("citizenId")}
              error={!!errors.citizenId}
              helperText={errors.citizenId?.message ?? " "}
            />
          </div>

          {/* Cột phải */}
          <div className="flex flex-col gap-4">
            {!isUpdate && (
              <TextField
                fullWidth
                type="password"
                label="Mật khẩu *"
                autoComplete="new-password"
                placeholder="Nhập mật khẩu (ít nhất 8 ký tự)"
                variant="outlined"
                {...register("staff_password")}
                error={!!errors.staff_password}
                helperText={errors.staff_password?.message ?? " "}
              />
            )}

            <TextField
              fullWidth
              type="tel"
              label="Số điện thoại *"
              placeholder="Nhập số điện thoại (10-11 số)"
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
                    label="Ngày sinh *"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) =>
                      field.onChange(date ? date.toDate() : null)
                    }
                    maxDate={dayjs()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
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

        {!data && (
          <FormControl fullWidth error={!!errors.role}>
            <InputLabel>Vai trò *</InputLabel>
            <Select
              label="Vai trò *"
              {...register("role")}
              defaultValue={Roles.TOURGUIDE}
            >
              <MenuItem value={Roles.TOURGUIDE}>Hướng dẫn viên</MenuItem>
              <MenuItem value={Roles.SUPERVISOR}>Giám sát</MenuItem>
            </Select>
            {errors.role && (
              <FormHelperText>{errors.role.message}</FormHelperText>
            )}
          </FormControl>
        )}

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
              backgroundColor: "primary.main",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
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
              "Cập nhật nhân viên"
            ) : (
              "Thêm nhân viên"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default StaffModal;
