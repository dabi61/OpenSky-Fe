import { useEffect, useState, type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTour } from "../contexts/TourContext";
import OverlayReload from "../components/Loading";
import {
  Paper,
  TextField,
  Button,
  Divider,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import {
  MapPin,
  Users,
  DollarSign,
  Camera,
  Save,
  ChevronLeft,
  Milestone,
  Plus,
  Calendar,
  Clock,
  User,
  Trash2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import {
  TourUpdateSchema,
  type TourUpdateValidateType,
} from "../types/schemas/tour.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import TourItineraryItem from "../components/TourItineraryItem";
import type { TourItineraryType } from "../types/response/tour_itinerary.type";
import TourItineraryModal from "../components/TourItineraryModal";
import { handleDeleteTourItinerary } from "../api/tourItinerary.api";
import { toast } from "sonner";
import Modal from "../components/Modal";
import { useSchedule } from "../contexts/ScheduleContext";
import type { ScheduleType } from "../types/response/schedule.type";
import { Dayjs } from "dayjs";
import type { ScheduleStatus } from "../constants/ScheduleStatus";
import ScheduleModal from "../components/ScheduleModal";
import Pagination from "../components/Pagination";
import { handleSoftDeleteSchedule } from "../api/schedule.api";

const TourEdit: FC = () => {
  const { id } = useParams();
  const {
    getTourById,
    selectedTour,
    getTourItineraryByTour,
    loading,
    tourItineraryList,
  } = useTour();
  const navigate = useNavigate();

  if (!id) {
    navigate("/Unauthorized");
  }

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const {
    getScheduleByTour,
    scheduleList,
    selectedSchedule,
    setSelectedSchedule,
  } = useSchedule();
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (id) {
        const res = await getScheduleByTour(id, page, itemsPerPage);
        setTotalPages(res.totalPages);
      }
    };
    fetchSchedule();
  }, [id, page]);

  const fetchTour = async () => {
    try {
      if (id) {
        const tour = await getTourById(id);
        if (tour) {
          await getTourItineraryByTour(id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch tour:", error);
    }
  };

  const [openModal, setOpenModal] = useState(false);
  const [selectedItinerry, setSelectedItinerary] =
    useState<TourItineraryType | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openScheduleInfo, setOpenScheduleInfo] = useState(false);
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);

  useEffect(() => {
    fetchTour();
  }, []);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<TourUpdateValidateType>({
    resolver: zodResolver(TourUpdateSchema),
    mode: "onBlur",
    defaultValues: {
      address: "",
      description: "",
      maxPeople: 0,
      price: 0,
      province: "",
      tourName: "",
    },
  });

  const handleDeleteSchedule = async (scheduleID: string) => {
    if (!id) return null;
    const res = await handleSoftDeleteSchedule(scheduleID);
    if (res.success) {
      toast.success(res.message);
      setOpenScheduleDialog(false);
      getScheduleByTour(id, page, itemsPerPage);
    } else {
      toast.error(res.message);
    }
  };

  useEffect(() => {
    if (selectedTour) {
      reset({
        address: selectedTour.address || "",
        description: selectedTour.description || "",
        maxPeople: selectedTour.maxPeople || 0,
        price: selectedTour.price || 0,
        province: selectedTour.province || "",
        tourName: selectedTour.tourName || "",
      });
    }
  }, [selectedTour, reset]);

  const formatDate = (date: Dayjs | Date | string) => {
    if (typeof date === "string") {
      return new Date(date).toLocaleDateString("vi-VN");
    }
    return date instanceof Date
      ? date.toLocaleDateString("vi-VN")
      : date.format("DD/MM/YYYY");
  };

  const formatTime = (date: Dayjs | Date | string) => {
    if (typeof date === "string") {
      return new Date(date).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date instanceof Date
      ? date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
      : date.format("HH:mm");
  };

  const getStatusColor = (status: ScheduleStatus) => {
    switch (status) {
      case "Active":
        return "success";
      case "End":
        return "primary";
      case "Suspend":
        return "warning";
      case "Removed":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return <OverlayReload />;
  }

  const onSubmit = () => {
    console.log("access!");
  };

  const handleDeleteItinerary = async (tourId: string) => {
    const res = await handleDeleteTourItinerary(tourId);
    if (res.success) {
      toast.success(res.message);
      await getTourItineraryByTour(id!);
    } else {
      toast.error(res.message);
    }
    setOpenDialog(false);
  };

  return (
    <>
      <form
        className="p-6 min-h-screen w-6/7 mx-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 cursor-pointer">
            <div
              className="bg-blue-500 rounded-full p-1"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft color="white" size={20} />
            </div>
            <div className="font-semibold">Quay lại</div>
          </div>
          <Button
            variant="contained"
            startIcon={<Save size={20} />}
            className="bg-blue-600 hover:bg-blue-700"
            type="submit"
          >
            Lưu thay đổi
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="lg:col-span-2">
            <Paper elevation={2} className="p-6 mb-6">
              <Typography variant="h6" className="font-semibold mb-4">
                Thông tin cơ bản
              </Typography>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-3">
                <TextField
                  fullWidth
                  label="Tên tour"
                  error={!!errors.tourName}
                  helperText={errors.tourName?.message || " "}
                  {...register("tourName")}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  {...register("address")}
                  error={!!errors.address}
                  helperText={errors.address?.message || " "}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <MapPin size={18} className="mr-2 text-gray-500" />
                    ),
                  }}
                />
              </div>

              <Divider className="my-4" />

              <Typography variant="h6" className="font-semibold mb-9">
                Thông tin giá và sức chứa
              </Typography>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-3">
                <TextField
                  fullWidth
                  label="Giá tour"
                  type="number"
                  error={!!errors.price}
                  helperText={errors.price?.message || " "}
                  {...register("price", { valueAsNumber: true })}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <DollarSign size={18} className="mr-2 text-gray-500" />
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Số người tối đa"
                  type="number"
                  {...register("maxPeople")}
                  error={!!errors.maxPeople}
                  helperText={errors.maxPeople?.message || " "}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <Users size={18} className="mr-2 text-gray-500" />
                    ),
                  }}
                />
              </div>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Mô tả tour"
                {...register("description")}
                error={!!errors.description}
                helperText={errors.description?.message || " "}
                variant="outlined"
                className="mb-4"
              />
            </Paper>

            <Paper elevation={2} className="p-6 mb-6">
              <div className="flex justify-between mb-5">
                <Typography
                  variant="h6"
                  className="font-semibold mb-7 flex items-center gap-2"
                >
                  <Calendar size={20} />
                  Lịch trình
                </Typography>
                <Button
                  onClick={() => {
                    setSelectedSchedule(null);
                    setOpenScheduleInfo(true);
                  }}
                  variant="contained"
                  sx={{
                    backgroundColor: "#3B82F6",
                    "&:hover": {
                      backgroundColor: "#2563EB",
                    },
                  }}
                >
                  <Plus />
                </Button>
              </div>
              {scheduleList.length > 0 ? (
                <>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Ngày bắt đầu</TableCell>
                          <TableCell>Ngày kết thúc</TableCell>
                          <TableCell>Số người</TableCell>
                          <TableCell>Còn lại</TableCell>
                          <TableCell>TourGuide</TableCell>
                          <TableCell>Trạng thái</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {scheduleList.map((schedule: ScheduleType) => (
                          <TableRow
                            key={schedule.scheduleID}
                            hover
                            sx={{ cursor: "pointer" }}
                            onClick={() => {
                              setSelectedSchedule(schedule);
                              setOpenScheduleInfo(true);
                            }}
                          >
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-gray-500" />
                                {formatDate(schedule.startTime)}
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <Clock size={16} className="text-gray-500" />
                                {formatTime(schedule.startTime)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-gray-500" />
                                {formatDate(schedule.endTime)}
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <Clock size={16} className="text-gray-500" />
                                {formatTime(schedule.endTime)}
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center gap-2">
                                <User size={16} className="text-gray-500" />
                                {schedule.numberPeople}
                              </div>
                            </TableCell>
                            <TableCell>
                              {schedule.remainingSlots !== null ? (
                                <Chip
                                  label={schedule.remainingSlots}
                                  size="small"
                                  color={
                                    schedule.remainingSlots > 0
                                      ? "success"
                                      : "error"
                                  }
                                  variant="outlined"
                                />
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium flex flex-col">
                                <div>{schedule.user.fullName}</div>
                                <div className="mt-2">
                                  {schedule.user.phoneNumber}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={schedule.status}
                                size="small"
                                color={getStatusColor(schedule.status)}
                                variant="filled"
                              />
                            </TableCell>
                            <TableCell>
                              <div
                                className={`flex my-auto p-2 rounded-lg transition-all opacity-100 text-red-400 hover:bg-red-50 hover:text-red-600"}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedSchedule(schedule);
                                  setOpenScheduleDialog(true);
                                }}
                              >
                                <Trash2 size={20} />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Pagination
                    page={page}
                    onChange={setPage}
                    totalPages={totalPages}
                  />
                </>
              ) : (
                <Card variant="outlined">
                  <CardContent className="text-center py-8">
                    <Calendar
                      size={48}
                      className="mx-auto mb-4 text-gray-400"
                    />
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      Chưa có lịch trình nào
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Hiện tại chưa có lịch trình nào được đặt cho tour này.
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Paper>

            <Paper elevation={2} className="p-6">
              <Typography
                variant="h6"
                className="font-semibold mb-4 flex items-center gap-2"
              >
                <Camera size={20} />
                Hình ảnh tour
              </Typography>

              <div className="mb-4">
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  startIcon={<Camera size={18} />}
                >
                  Tải lên hình ảnh
                  <input type="file" hidden accept="image/*" multiple />
                </Button>
              </div>

              <div className="flex gap-2 mt-4">
                {selectedTour?.images?.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img.imageUrl}
                      alt={`Tour image ${index + 1}`}
                      className="w-auto h-40 object-cover rounded-md"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-md transition-opacity">
                      <Button size="small" color="error" variant="contained">
                        Xóa
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {(!selectedTour?.images || selectedTour.images.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <Camera size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Chưa có hình ảnh nào</p>
                </div>
              )}
            </Paper>
          </div>
        </div>

        <div className="shadow-lg rounded-2xl overflow-hidden mt-6 bg-white p-6">
          <div className="flex justify-between mb-5">
            <Typography
              variant="h6"
              className="font-semibold mb-7 flex items-center gap-2"
            >
              <Milestone size={20} />
              Hành trình
            </Typography>
            <Button
              onClick={() => {
                setSelectedItinerary(null);
                setOpenModal(true);
              }}
              variant="contained"
              sx={{
                backgroundColor: "#3B82F6",
                "&:hover": {
                  backgroundColor: "#2563EB",
                },
              }}
            >
              <Plus />
            </Button>
          </div>

          <div className="relative border-l-4 border-blue-400 pl-6 space-y-8">
            {tourItineraryList.map((itinerary) => (
              <TourItineraryItem
                itinerary={itinerary}
                key={itinerary.itineraryID}
                onDelete={() => {
                  setSelectedItinerary(itinerary);
                  setOpenDialog(true);
                }}
                onClick={() => {
                  setSelectedItinerary(itinerary);
                  setOpenModal(true);
                }}
              />
            ))}
          </div>
        </div>
      </form>
      <TourItineraryModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        data={selectedItinerry}
        tourId={id!}
        onSuccess={() => getTourItineraryByTour(id!)}
      />
      <Modal
        isOpen={openDialog}
        title="Thông báo"
        description="Bạn có muốn xóa địa điểm này khỏi tour?"
        onClose={() => setOpenDialog(false)}
        onAgree={() => handleDeleteItinerary(selectedItinerry?.itineraryID!)}
      />
      <Modal
        isOpen={openScheduleDialog}
        title="Thông báo"
        description="Bạn có muốn xóa lịch trình này khỏi tour?"
        onClose={() => setOpenScheduleDialog(false)}
        onAgree={() => handleDeleteSchedule(selectedSchedule?.scheduleID!)}
      />
      <ScheduleModal
        isOpen={openScheduleInfo}
        onClose={() => setOpenScheduleInfo(false)}
        data={selectedSchedule}
        onSuccess={() => getScheduleByTour(id!, page, itemsPerPage)}
      />
    </>
  );
};

export default TourEdit;
