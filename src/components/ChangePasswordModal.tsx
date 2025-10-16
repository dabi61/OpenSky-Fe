import type { FC } from "react";
import { useForm } from "react-hook-form";
import {
  changePasswordSchema,
  type ChangePasswordType,
  type ChangePasswordWithoutReType,
} from "../types/schemas/changePassword.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button } from "@mui/material";
import { Loader2 } from "lucide-react";
import Modal from "./Modal";
import { handleChangePassword } from "../api/auth.api";
import { toast } from "sonner";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: FC<ModalProps> = ({ isOpen, onClose }) => {
  const {
    register,
    formState: { errors, isSubmitting, isValid },
    handleSubmit,
    reset,
  } = useForm<ChangePasswordType>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: ChangePasswordType) => {
    const dataForm: ChangePasswordWithoutReType = {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    };
    const res = await handleChangePassword(dataForm);
    if (res.success) {
      toast.success(res.message);
      onClose();
      reset();
    } else {
      toast.error(res.message || "Có lỗi đã xảy ra!");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setTimeout(() => {
          reset();
        }, 500);
      }}
      title="Đổi mật khẩu"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mx-auto mt-5 flex flex-col gap-5"
      >
        <TextField
          {...register("currentPassword")}
          label="Mật khẩu hiện tại"
          type="password"
          fullWidth
          variant="outlined"
          error={!!errors.currentPassword}
          helperText={errors.currentPassword?.message || " "}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          {...register("newPassword")}
          label="Mật khẩu mới"
          type="password"
          fullWidth
          variant="outlined"
          error={!!errors.newPassword}
          helperText={errors.newPassword?.message || " "}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          {...register("reNewPassword")}
          label="Nhập lại mật khẩu mới"
          type="password"
          fullWidth
          variant="outlined"
          error={!!errors.reNewPassword}
          helperText={errors.reNewPassword?.message || " "}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isSubmitting || !isValid}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 py-3"
          size="large"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader2 size={18} className="animate-spin" />
              Đang xử lý...
            </div>
          ) : (
            "Đổi mật khẩu"
          )}
        </Button>
      </form>
    </Modal>
  );
};
