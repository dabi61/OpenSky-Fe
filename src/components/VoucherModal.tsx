import { useEffect, type FC } from "react";
import Modal from "./Modal";
import { VoucherEnum } from "../constants/VoucherEnum";
import {
  MenuItem,
  Select,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  FormHelperText,
} from "@mui/material";
import type { VoucherType } from "../types/response/voucher.type";
import { Controller, useForm } from "react-hook-form";
import {
  VoucherSchema,
  VoucherUpdateSchema,
  type VoucherCreateValidateType,
  type VoucherUpdateValidateType,
} from "../types/schemas/voucher.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { handleCreateVoucher, handleUpdateVoucher } from "../api/voucher.api";
import { toast } from "sonner";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: VoucherType | null;
  onSuccess?: () => void;
}

const VoucherModal: FC<ModalProps> = ({ isOpen, onClose, data, onSuccess }) => {
  const {
    register,
    formState: { errors },
    reset,
    control,
    handleSubmit,
  } = useForm<VoucherCreateValidateType | VoucherUpdateValidateType>({
    resolver: zodResolver(data ? VoucherUpdateSchema : VoucherSchema),
    mode: "onBlur",
    defaultValues: {
      code: "",
      description: "",
      percent: 0,
      tableType: VoucherEnum.HOTEL,
      startDate: undefined,
      endDate: undefined,
    },
  });

  const onCreateSubmit = async (voucher: VoucherCreateValidateType) => {
    const res = await handleCreateVoucher(voucher);
    if (res.voucherId) {
      onSuccess?.();
      toast.success(res.message);
      onClose();
    } else {
      toast.error(res.message);
    }
  };

  const onUpdateSubmit = async (voucher: VoucherUpdateValidateType) => {
    if (!data?.voucherID) return;

    const updatedVoucher = { ...voucher };

    if (voucher.code === data.code) {
      delete updatedVoucher.code;
    }

    const res = await handleUpdateVoucher(data.voucherID, updatedVoucher);

    if (res.success) {
      onSuccess?.();
      toast.success(res.message);
      onClose();
    } else {
      toast.error(res.message);
    }
  };

  const onSubmit = (
    voucher: VoucherCreateValidateType | VoucherUpdateValidateType
  ) => {
    if (data) {
      onUpdateSubmit(voucher as VoucherUpdateValidateType);
    }
    if (!data) {
      onCreateSubmit(voucher as VoucherCreateValidateType);
    }
  };

  useEffect(() => {
    if (data) {
      reset({
        code: data.code || "",
        description: data.description || "",
        percent: data.percent || 0,
        tableType: data.tableType || VoucherEnum.HOTEL,
        startDate: data.startDate ? dayjs(data.startDate).toDate() : undefined,
        endDate: data.endDate ? dayjs(data.endDate).toDate() : undefined,
      });
    } else {
      reset({
        code: "",
        description: "",
        percent: 0,
        tableType: VoucherEnum.HOTEL,
        startDate: undefined,
        endDate: undefined,
      });
    }
  }, [data, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        reset();
        onClose();
      }}
      reset={reset}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" flexDirection="column" gap={3}>
          <Box>
            <Typography variant="body2" fontWeight={500} mb={0.5}>
              Mã Voucher *
            </Typography>
            <TextField
              fullWidth
              placeholder="Nhập mã voucher"
              size="small"
              {...register("code")}
              error={!!errors.code}
              helperText={errors.code?.message || " "}
            />
          </Box>

          <Box display="flex" gap={2}>
            <Box flex={1}>
              <Typography variant="body2" fontWeight={500} mb={0.5}>
                Phần trăm giảm giá *
              </Typography>
              <TextField
                type="number"
                {...register("percent", { valueAsNumber: true })}
                error={!!errors.percent}
                helperText={errors.percent?.message || " "}
                placeholder="1-100%"
                fullWidth
                size="small"
              />
            </Box>

            <Box flex={1}>
              <Typography variant="body2" fontWeight={500} mb={0.5}>
                Loại Voucher *
              </Typography>
              <FormControl fullWidth error={!!errors.tableType}>
                <Controller
                  name="tableType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="role-label"
                      size="small"
                      defaultValue={field.value || ""}
                    >
                      <MenuItem value={VoucherEnum.HOTEL}>Khách sạn</MenuItem>
                      <MenuItem value={VoucherEnum.TOUR}>Tour</MenuItem>
                    </Select>
                  )}
                />
                <FormHelperText>
                  {errors.tableType?.message ?? " "}
                </FormHelperText>
              </FormControl>
            </Box>
          </Box>

          <Box display="flex" gap={2}>
            <Box flex={1}>
              <Typography variant="body2" fontWeight={500} mb={0.5}>
                Ngày bắt đầu *
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) =>
                        field.onChange(date ? date.toDate() : null)
                      }
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                          InputLabelProps: { shrink: true },
                          error: !!errors.startDate,
                          helperText: errors.startDate?.message,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Box>

            <Box flex={1}>
              <Typography variant="body2" fontWeight={500} mb={0.5}>
                Ngày kết thúc *
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) =>
                        field.onChange(date ? date.toDate() : null)
                      }
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                          InputLabelProps: { shrink: true },
                          error: !!errors.endDate,
                          helperText: errors.endDate?.message,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Box>
          </Box>

          <Box>
            <Typography variant="body2" fontWeight={500} mb={0.5}>
              Mô tả *
            </Typography>
            <TextField
              placeholder="Nhập mô tả voucher"
              fullWidth
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message || " "}
              multiline
              rows={3}
              size="small"
            />
          </Box>
        </Box>

        <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
          <Button
            onClick={() => {
              reset();
              onClose();
            }}
            variant="outlined"
            color="inherit"
          >
            Hủy
          </Button>

          <Button variant="contained" color="primary" type="submit">
            Xác nhận
          </Button>
        </Box>
      </form>
    </Modal>
  );
};

export default VoucherModal;
