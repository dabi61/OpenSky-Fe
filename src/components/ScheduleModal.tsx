import { useEffect, useState, type FC } from "react";
import Modal from "./Modal";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { User, Check } from "lucide-react";
import {
  TextField,
  Button,
  Box,
  Avatar,
  Stack,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  InputLabel,
} from "@mui/material";
import dayjs from "dayjs";
import {
  ScheduleSchema,
  ScheduleUpdateSchema,
  type UpdateScheduleType,
  type CreateScheduleType,
} from "../types/schemas/schedule.schema";
import { Controller, useForm } from "react-hook-form";
import type { ScheduleType } from "../types/response/schedule.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "../contexts/UserContext";
import { Roles } from "../constants/role";
import Pagination from "./Pagination";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useParams } from "react-router-dom";
import { ScheduleStatus } from "../constants/ScheduleStatus";
import {
  handleCreateSchedule,
  handleUpdateSchedule,
} from "../api/schedule.api";
import { toast } from "sonner";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: ScheduleType | null;
  onSuccess?: () => void;
}

const ScheduleModal: FC<ModalProps> = ({
  isOpen,
  onClose,
  data,
  onSuccess,
}) => {
  const {
    control,
    register,
    setValue,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
  } = useForm<CreateScheduleType | UpdateScheduleType>({
    resolver: zodResolver(data ? ScheduleUpdateSchema : ScheduleSchema),
    mode: "onBlur",
  });

  const { getUsersByRole, userList } = useUser();
  const { id } = useParams();

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsersByRole([Roles.TOURGUIDE], currentPage, 10);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  useEffect(() => {
    if (data) {
      reset({
        endTime: dayjs(data.endTime).toDate() || id,
        startTime: dayjs(data.startTime).toDate() || undefined,
        numberPeople: data.numberPeople || 0,
        userID: data.user.userID || undefined,
        tourID: data.tourID || id,
      });
    } else {
      reset({
        endTime: undefined,
        startTime: undefined,
        numberPeople: 0,
        userID: undefined,
        tourID: id,
      });
    }
  }, [data, isOpen]);

  const createSubmit = async (formData: CreateScheduleType) => {
    const res = await handleCreateSchedule(formData);
    if (res.scheduleId) {
      toast.success(res.message);
      onSuccess?.();
    } else {
      toast.error(res.message);
    }
    onClose();
    reset();
  };

  const updateSubmit = async (formData: UpdateScheduleType) => {
    if (!data?.scheduleID) return null;
    const res = await handleUpdateSchedule(data.scheduleID, formData);
    if (res.success) {
      toast.success(res.message);
      onSuccess?.();
    } else {
      toast.error(res.message);
    }
    onClose();
    reset();
  };

  const onSubmit = (formData: CreateScheduleType | UpdateScheduleType) => {
    if (data) {
      updateSubmit(formData as UpdateScheduleType);
    } else {
      createSubmit(formData as CreateScheduleType);
    }
  };

  const selectedTourGuideID = watch("userID");

  const handleSelectTourGuide = (userID: string) => {
    setValue("userID", userID);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        reset();
      }}
      title={data ? "Chỉnh sửa lịch trình" : "Tạo lịch trình mới"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6 space-y-4">
          <Box className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-700">
                Chọn hướng dẫn viên ({userList.length})
              </h4>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  Trang {currentPage} / {totalPages}
                </span>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-4">
                <span className="text-gray-500">Đang tải...</span>
              </div>
            ) : (
              <>
                <Stack spacing={2} className="max-h-60 overflow-y-auto mb-3">
                  {userList.map((user) => (
                    <Box
                      key={user.userID}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedTourGuideID === user.userID
                          ? "bg-blue-100 border-blue-300 shadow-sm"
                          : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm"
                      }`}
                      onClick={() => handleSelectTourGuide(user.userID)}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar
                          src={user.avatarURL}
                          sx={{ width: 44, height: 44 }}
                          className="border-2 border-white"
                        >
                          <User className="w-5 h-5" />
                        </Avatar>
                        <Stack className="flex-1">
                          <span className="font-medium text-gray-900">
                            {user.fullName}
                          </span>
                          <span className="text-sm text-gray-500">
                            {user.phoneNumber}
                          </span>
                        </Stack>
                        {selectedTourGuideID === user.userID && (
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </Stack>
                    </Box>
                  ))}
                </Stack>

                <Pagination
                  totalPages={totalPages}
                  page={currentPage}
                  onChange={(p) => {
                    setCurrentPage(p);
                  }}
                />
              </>
            )}
          </Box>

          <input type="hidden" {...register("userID")} />

          {data && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-gray-700 font-medium">Ngày</span>
              <span className="text-gray-900 font-semibold">
                {dayjs(data.startTime).format("DD/MM/YYYY")}
              </span>
            </div>
          )}

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="startTime"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  label="Thời gian bắt đầu"
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
                      error: !!errors.startTime,
                      helperText: errors.startTime?.message,
                    },
                  }}
                  onError={() => {}}
                />
              )}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="endTime"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  label="Thời gian kết thúc"
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
                      error: !!errors.endTime,
                      helperText: errors.endTime?.message,
                    },
                  }}
                />
              )}
            />
          </LocalizationProvider>

          <Box>
            <TextField
              {...register("numberPeople", { valueAsNumber: true })}
              label="Số người"
              type="number"
              fullWidth
              error={!!errors.numberPeople}
              helperText={errors.numberPeople?.message}
              margin="normal"
              InputProps={{
                inputProps: { min: 0 },
              }}
            />
          </Box>

          {data && (
            <Box flex={1}>
              <FormControl
                fullWidth
                error={!!(errors as any).status}
                size="medium"
              >
                <InputLabel id="status-label" shrink>
                  Trạng thái
                </InputLabel>
                <Controller
                  name="status"
                  control={control}
                  defaultValue={data.status}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="status-label"
                      label="Trạng thái"
                      displayEmpty
                    >
                      {Object.values(ScheduleStatus)
                        .filter((statuses) => statuses !== "Removed")
                        .map((status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                />
                <FormHelperText>
                  {(errors as any).status?.message ?? " "}
                </FormHelperText>
              </FormControl>
            </Box>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={
              !selectedTourGuideID ||
              (data?.status && !["Active", "Suspend"].includes(data.status))
            }
          >
            {data ? "Cập nhật" : "Tạo lịch trình"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ScheduleModal;
