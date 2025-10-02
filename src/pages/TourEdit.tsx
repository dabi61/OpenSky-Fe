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
  CircularProgress,
} from "@mui/material";
import {
  MapPin,
  Users,
  DollarSign,
  Camera,
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
import { useImage } from "../contexts/ImageContext";
import { handleUpdateTour } from "../api/tour.api";

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

  const { addImageList, imageList, previewImageList, deleteImage } = useImage();
  const [openModal, setOpenModal] = useState(false);
  const [selectedItinerry, setSelectedItinerary] =
    useState<TourItineraryType | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openScheduleInfo, setOpenScheduleInfo] = useState(false);
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const [deleteImgIds, setDeleteImgIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTour();
  }, []);

  const {
    handleSubmit,
    register,
    reset,
    setValue,
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

  setValue("deleteImageIds", deleteImgIds);
  setValue("files", imageList);

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

  const onSubmit = async (data: TourUpdateValidateType) => {
    setIsSubmitting(true);
    try {
      const res = await handleUpdateTour(id!, data);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật tour");
    } finally {
      setIsSubmitting(false);
    }
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
        className="py-6 md:px-6 min-h-screen md:w-6/7 mx-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex items-center px-3 md:px-0 justify-between mb-6">
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
            className="bg-blue-600 hover:bg-blue-700"
            type="submit"
            sx={{
              backgroundColor: "#3B82F6",
              "&:hover": {
                backgroundColor: "#2563EB",
              },
              "&:disabled": {
                backgroundColor: "#93C5FD",
              },
            }}
            disabled={isSubmitting}
            startIcon={
              isSubmitting && <CircularProgress size={16} color="inherit" />
            }
          >
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
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
                  {...register("maxPeople", {
                    required: "Vui lòng nhập số người tối đa",
                    valueAsNumber: true,
                  })}
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

            <Paper elevation={2} className="p-4 md:p-6 mb-6">
              <div className="flex justify-between items-center mb-4 md:mb-5">
                <Typography
                  variant="h6"
                  className="font-semibold flex items-center gap-2 text-lg md:text-xl"
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
                  <div className="hidden md:block">
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell className="font-semibold">
                              Ngày bắt đầu
                            </TableCell>
                            <TableCell className="font-semibold">
                              Ngày kết thúc
                            </TableCell>

                            <TableCell className="font-semibold">
                              Còn lại
                            </TableCell>
                            <TableCell className="font-semibold">
                              TourGuide
                            </TableCell>
                            <TableCell className="font-semibold">
                              Trạng thái
                            </TableCell>
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
                                  <Calendar
                                    size={16}
                                    className="text-gray-500"
                                  />
                                  {formatDate(schedule.startTime)}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <Clock size={16} className="text-gray-500" />
                                  {formatTime(schedule.startTime)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Calendar
                                    size={16}
                                    className="text-gray-500"
                                  />
                                  {formatDate(schedule.endTime)}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <Clock size={16} className="text-gray-500" />
                                  {formatTime(schedule.endTime)}
                                </div>
                              </TableCell>

                              <TableCell>{schedule.numberPeople}</TableCell>
                              <TableCell>
                                <div className="font-medium">
                                  <div className="text-sm">
                                    {schedule.user.fullName}
                                  </div>
                                  <div className="text-xs text-gray-600 mt-1">
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
                                  className="flex p-2 rounded-lg transition-all text-red-400 hover:bg-red-50 hover:text-red-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedSchedule(schedule);
                                    setOpenScheduleDialog(true);
                                  }}
                                >
                                  <Trash2 size={18} />
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>

                  <div className="md:hidden space-y-4">
                    {scheduleList.map((schedule: ScheduleType) => (
                      <Card
                        key={schedule.scheduleID}
                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          setSelectedSchedule(schedule);
                          setOpenScheduleInfo(true);
                        }}
                      >
                        <CardContent className="p-0">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Calendar size={16} className="text-gray-500" />
                                <span className="font-medium text-sm">
                                  {formatDate(schedule.startTime)} -
                                  {formatDate(schedule.endTime)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <Clock size={14} />
                                <span>
                                  {formatTime(schedule.startTime)} -{" "}
                                  {formatTime(schedule.endTime)}
                                </span>
                              </div>
                            </div>
                            <div
                              className="flex p-2 rounded-lg transition-all text-red-400 hover:bg-red-50 hover:text-red-600 ml-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSchedule(schedule);
                                setOpenScheduleDialog(true);
                              }}
                            >
                              <Trash2 size={16} />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <User size={14} className="text-gray-500" />
                              <span>
                                Số người:
                                <strong>{schedule.numberPeople}</strong>
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600 mr-2">
                                Còn lại:
                              </span>
                              <Chip
                                label={schedule.numberPeople}
                                size="small"
                                color={
                                  schedule.numberPeople > 0
                                    ? "success"
                                    : "error"
                                }
                                variant="outlined"
                              />
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium text-sm">
                                  {schedule.user.fullName}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {schedule.user.phoneNumber}
                                </div>
                              </div>
                              <Chip
                                label={schedule.status}
                                size="small"
                                color={getStatusColor(schedule.status)}
                                variant="filled"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="mt-4">
                    <Pagination
                      page={page}
                      onChange={setPage}
                      totalPages={totalPages}
                    />
                  </div>
                </>
              ) : (
                <Card variant="outlined">
                  <CardContent className="text-center py-8">
                    <Calendar
                      size={48}
                      className="mx-auto mb-4 text-gray-400"
                    />
                    <Typography
                      variant="h6"
                      color="textSecondary"
                      gutterBottom
                      className="text-lg"
                    >
                      Chưa có lịch trình nào
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      className="text-sm md:text-base"
                    >
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
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    multiple
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const files = e.target.files
                        ? Array.from(e.target.files)
                        : [];
                      if (files.length > 0) {
                        addImageList(files, 7);
                      }
                    }}
                  />
                </Button>
              </div>

              <div className="flex gap-2 mt-4">
                {selectedTour?.images
                  .filter((img) => !deleteImgIds.includes(img.imageId))
                  .map((img) => (
                    <div key={img.imageId} className="relative group">
                      <img
                        src={img.imageUrl}
                        alt={`Tour image ${img.imageId}`}
                        className="w-auto h-40 object-cover rounded-md"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-md transition-opacity">
                        <Button
                          onClick={() =>
                            setDeleteImgIds((prev) => [...prev, img.imageId])
                          }
                          size="small"
                          color="error"
                          variant="contained"
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                  ))}
                {previewImageList.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Tour image ${index + 1}`}
                      className="w-auto h-40 object-cover rounded-md"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-md transition-opacity">
                      <Button
                        onClick={() => deleteImage(index)}
                        size="small"
                        color="error"
                        variant="contained"
                      >
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
