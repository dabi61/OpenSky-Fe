import { useLocation, useParams } from "react-router-dom";
import { useHotel } from "../contexts/HotelContext";
import { useEffect, useState } from "react";
import {
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import { MapPin, Camera, Mail, User, MapPinned, Info } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import {
  HotelUpdateSchema,
  type HotelupdateValidateType,
} from "../types/schemas/hotel.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCoordinates } from "../api/geocode.api";
import { toast } from "sonner";
import { getProvinces } from "../api/province.api";
import { handleUpdateHotel } from "../api/hotel.api";
import CircularProgress from "@mui/material/CircularProgress";
import { useImage } from "../contexts/ImageContext";

const HotelEdit: React.FC = () => {
  const { getHotelById, selectedHotel, loading, getMyHotel } = useHotel();
  const { id } = useParams();
  const location = useLocation().pathname;
  const [deleteImgIds, setDeleteImgIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addImageList, imageList, previewImageList, deleteImage } = useImage();

  const fetchHotel = async () => {
    try {
      if (id) {
        await getHotelById(id);
      }
      if (location === `/my_hotel/hotel_edit`) {
        await getMyHotel();
      }
    } catch (error) {
      console.error("Failed to fetch hotel:", error);
    }
  };

  useEffect(() => {
    fetchHotel();
  }, []);

  const [coordinates, setCoordinates] = useState({
    lon: selectedHotel?.longitude,
    lat: selectedHotel?.latitude,
  });

  useEffect(() => {
    if (selectedHotel) {
      setCoordinates({
        lat: selectedHotel.latitude || 0,
        lon: selectedHotel.longitude || 0,
      });
    }
  }, [selectedHotel]);

  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
    control,
    reset,
    setValue,
  } = useForm<HotelupdateValidateType>({
    resolver: zodResolver(HotelUpdateSchema),
    mode: "onBlur",
  });

  setValue("deleteImageIds", deleteImgIds);
  setValue("files", imageList);

  useEffect(() => {
    if (selectedHotel) {
      reset({
        hotelName: selectedHotel.hotelName || "",
        email: selectedHotel.email || "",
        address: selectedHotel.address || "",
        province: selectedHotel.province || "",
        longitude: selectedHotel.longitude || 0,
        latitude: selectedHotel.latitude || 0,
        description: selectedHotel.description || "",
        status: selectedHotel.status || "Inactive",
      });
    }
  }, [selectedHotel]);

  if (loading || !selectedHotel) {
    return (
      <div className="flex justify-center mt-20">
        <CircularProgress size="3rem" color="primary" />
      </div>
    );
  }

  const handleLoadLocation = async (address: string) => {
    const res = await getCoordinates(address);
    if (res) {
      setCoordinates({
        lat: res?.latitude,
        lon: res?.lontitude,
      });
    } else {
      toast.error("Tọa độ này không khả dụng!");
    }
  };

  const onSubmit = async (data: HotelupdateValidateType) => {
    const res = await handleUpdateHotel(selectedHotel?.hotelID, data);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  const submitForm = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSubmitting(true);

    try {
      if (coordinates.lat !== 0 && coordinates.lon !== 0) {
        setValue("latitude", coordinates.lat);
        setValue("longitude", coordinates.lon);
      }

      const address = watch("address");
      const allProvinces = await getProvinces();
      if (address) {
        const parts = address.split(",").map((p) => p.trim());
        const lastPart = parts[parts.length - 1];
        const matchedProvince = allProvinces.find(
          (province) =>
            province.province_name.toLowerCase() === lastPart.toLowerCase()
        );
        if (!matchedProvince) {
          toast.error("Can't find this province!");
          return;
        }
        setValue("province", matchedProvince.province_name);
      }
      await handleSubmit(onSubmit)();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Có lỗi xảy ra khi gửi form!");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form className="p-6 bg-gray-50 min-h-screen" onSubmit={submitForm}>
      <div className="flex flex-col mx-auto items-center gap-6">
        <div className="w-screen lg:w-2/3">
          <div className="flex justify-end">
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
          <Paper elevation={2} className="p-6 mt-3">
            <Typography
              variant="h6"
              className="font-semibold mb-4 flex items-center gap-2"
            >
              <User size={20} />
              Thông tin chung
            </Typography>

            <div className="flex flex-col md:flex-row gap-4 mb-4 mt-3">
              <TextField
                fullWidth
                label="Tên khách sạn"
                {...register("hotelName")}
                error={!!errors.hotelName}
                helperText={errors.hotelName?.message || " "}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message || " "}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={18} className="text-gray-500" />
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <Typography
              variant="h6"
              className="font-semibold mb-4 flex items-center gap-2"
            >
              <MapPin size={20} />
              Địa chỉ
            </Typography>

            <div className="flex flex-col mb-4 mt-3">
              <div className="flex gap-2">
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  placeholder="Địa chỉ (VD: Cầu Giấy, Dịch Vọng, Hà Nội)"
                  {...register("address")}
                  error={!!errors.address}
                  helperText={errors.address?.message || " "}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MapPin size={18} className="text-gray-500" />
                      </InputAdornment>
                    ),
                  }}
                />
                <button
                  type="button"
                  className="border border-gray-400 rounded-md px-4 h-14 text-gray-500 hover:text-gray-600 cursor-pointer"
                  onClick={() => handleLoadLocation(watch("address") ?? "")}
                >
                  <MapPinned />
                </button>
              </div>
              <div></div>
              {coordinates.lat !== 0 && coordinates.lon !== 0 && (
                <iframe
                  width="100%"
                  height="400"
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lon}&hl=vi&z=15&output=embed`}
                ></iframe>
              )}
            </div>

            <Typography
              variant="h6"
              className="font-semibold mb-4 flex items-center gap-2"
            >
              <Info size={20} />
              Thông tin bổ sung
            </Typography>

            <div className="flex flex-col md:flex-row gap-4 mb-4 mt-3">
              <FormControl fullWidth error={!!errors.status}>
                <InputLabel>Trạng thái</InputLabel>
                <Controller
                  name="status"
                  control={control}
                  defaultValue={selectedHotel?.status || "Inactive"}
                  render={({ field }) => (
                    <Select {...field} label="Trạng thái">
                      <MenuItem value="Active">Hoạt động</MenuItem>
                      <MenuItem value="Inactive">Ngừng hoạt động</MenuItem>
                      <MenuItem value="Suspend">Tạm ngưng</MenuItem>
                      <MenuItem value="Removed">Đã xóa</MenuItem>
                    </Select>
                  )}
                />
                {errors.status && (
                  <FormHelperText>{errors.status.message}</FormHelperText>
                )}
              </FormControl>
            </div>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Mô tả"
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message || " "}
              variant="outlined"
            />
          </Paper>
        </div>

        <div className="w-screen lg:w-2/3">
          <Paper elevation={2} className="p-6 mb-6">
            <Typography
              variant="h6"
              className="font-semibold mb-4 flex items-center gap-2"
            >
              <Camera size={20} />
              Hình ảnh khách sạn
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
              {selectedHotel?.images
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

            {(!selectedHotel?.images || selectedHotel.images.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <Camera size={48} className="mx-auto mb-2 opacity-50" />
                <p>Chưa có hình ảnh nào</p>
              </div>
            )}
          </Paper>

          {!location.includes(`/my_hotel`) && (
            <Paper elevation={2} className="p-6">
              <Typography
                variant="h6"
                className="font-semibold mb-4 flex items-center gap-2"
              >
                <User size={20} />
                Thông tin chủ khách sạn
              </Typography>

              {selectedHotel?.user && (
                <div className="space-y-3">
                  <div>
                    <Typography variant="subtitle2" className="text-gray-600">
                      Tên người dùng
                    </Typography>
                    <Typography>
                      {selectedHotel.user.fullName || "Chưa có thông tin"}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" className="text-gray-600">
                      Email
                    </Typography>
                    <Typography>
                      {selectedHotel.user.email || "Chưa có thông tin"}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" className="text-gray-600">
                      Số điện thoại
                    </Typography>
                    <Typography>
                      {selectedHotel.user.phoneNumber || "Chưa có thông tin"}
                    </Typography>
                  </div>
                </div>
              )}
            </Paper>
          )}
        </div>
      </div>
    </form>
  );
};

export default HotelEdit;
