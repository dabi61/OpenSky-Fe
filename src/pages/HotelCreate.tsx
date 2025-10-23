import { Button, TextField, CircularProgress } from "@mui/material";
import { ChevronLeft, CloudUpload, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  HotelSchema,
  type HotelCreateValidateType,
} from "../types/schemas/hotel.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCoordinates } from "../api/geocode.api";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useImage } from "../contexts/ImageContext";
import useEmblaCarousel from "embla-carousel-react";
import { handleCreateHotel } from "../api/hotel.api";
import { getProvinces } from "../api/province.api";
import { useNavigate } from "react-router-dom";

const HotelCreate = () => {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();
  const [coordinates, setCoordinates] = useState({ lon: 0, lat: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [emblaRefImages] = useEmblaCarousel({ axis: "x", dragFree: true });
  const { imageList, addImageList, deleteImage, previewImageList } = useImage();
  const {
    watch,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<HotelCreateValidateType>({
    resolver: zodResolver(HotelSchema),
    mode: "onBlur",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const onSubmit = async (data: HotelCreateValidateType) => {
    const allProvinces = await getProvinces();
    const parts = data.address.split(",").map((p) => p.trim());
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

    const res = await handleCreateHotel(data);
    if (res.hotelID) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  const submitForm = async () => {
    setIsLoading(true);

    try {
      if (coordinates.lat !== 0 && coordinates.lon !== 0) {
        setValue("latitude", coordinates.lat);
        setValue("longitude", coordinates.lon);
      }
      if (imageList.length > 0) {
        setValue("files", imageList);
      }

      const address = watch("address");
      const allProvinces = await getProvinces();
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

      await handleSubmit(onSubmit)();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Có lỗi xảy ra khi gửi form!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="w-6/7 mx-auto mt-10"
      onSubmit={(e) => {
        e.preventDefault();
        submitForm();
      }}
    >
      <div
        className="flex gap-2 items-center cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <div className="bg-blue-500 rounded-full p-1">
          <ChevronLeft color="white" size={20} />
        </div>
        <div className="font-semibold">Quay lại</div>
      </div>
      <div className="border rounded-2xl p-10 mt-5 border-blue-500">
        <div className="font-semibold flex justify-center text-2xl mb-10">
          Thông tin khách sạn
        </div>
        <div className="px-20 flex flex-col gap-10">
          <TextField
            fullWidth
            variant="outlined"
            {...register("hotelName")}
            label="Tên khách sạn"
            error={!!errors.hotelName}
            helperText={errors.hotelName?.message}
            InputLabelProps={{
              shrink: true,
              sx: {
                fontWeight: "bold",
                fontSize: "1.25rem",
                transform: "translate(14px, -9px) scale(0.8)",
                backgroundColor: "white",
                padding: "0 8px",
                marginLeft: "-8px",
              },
            }}
          />
          <TextField
            fullWidth
            variant="outlined"
            {...register("email")}
            label="Nhập email liên hệ"
            error={!!errors.email}
            helperText={errors.email?.message}
            InputLabelProps={{
              shrink: true,
              sx: {
                fontWeight: "bold",
                fontSize: "1.25rem",
                backgroundColor: "white",
                transform: "translate(14px, -9px) scale(0.8)",
                padding: "0 8px",
                marginLeft: "-8px",
              },
            }}
          />

          <TextField
            fullWidth
            variant="outlined"
            label="Địa chỉ"
            placeholder="Địa chỉ (VD: Cầu Giấy, Dịch Vọng, Hà Nội)"
            error={!!errors.address}
            helperText={errors.address?.message}
            {...register("address")}
            InputLabelProps={{
              shrink: true,
              sx: {
                fontWeight: "bold",
                fontSize: "1.25rem",
                backgroundColor: "white",
                transform: "translate(14px, -9px) scale(0.8)",
                padding: "0 8px",
                marginLeft: "-8px",
              },
            }}
          />

          <Button
            variant="outlined"
            onClick={() => handleLoadLocation(watch("address"))}
            disabled={isLoading}
          >
            Xem bản đồ
          </Button>
          {coordinates.lat !== 0 && coordinates.lon !== 0 && (
            <iframe
              width="100%"
              height="400"
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lon}&hl=vi&z=15&output=embed`}
            ></iframe>
          )}

          <TextField
            fullWidth
            variant="outlined"
            label="Mô tả"
            error={!!errors.description}
            helperText={errors.description?.message}
            multiline
            {...register("description")}
            minRows={4}
            InputLabelProps={{
              shrink: true,
              sx: {
                fontWeight: "bold",
                fontSize: "1.25rem",
                backgroundColor: "white",
                transform: "translate(14px, -9px) scale(0.8)",
                padding: "0 8px",
                marginLeft: "-8px",
              },
            }}
          />

          <div>
            <div className="mx-auto p-6 bg-white rounded-lg shadow-md">
              <div className="font-bold text-gray-600 mb-4 text-xl">Ảnh</div>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors mb-6 border-gray-300 hover:border-blue-400 ${
                  isLoading ? "opacity-50 pointer-events-none" : ""
                }`}
                onClick={() => {
                  if (!isLoading && fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
              >
                <div className="flex flex-col items-center justify-center">
                  <CloudUpload size={50} color="gray" />
                  <p className="text-gray-600 mt-3">
                    Nhấp để tải ảnh lên hoặc kéo thả ảnh vào đây
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Hỗ trợ PNG, JPG, JPEG
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (!isLoading && e.target.files) {
                      const files = Array.from(e.target.files);
                      addImageList(files, 7);
                    }
                  }}
                  multiple
                  accept="image/*"
                  disabled={isLoading}
                />
              </div>

              {imageList.length > 0 && (
                <div
                  ref={emblaRefImages}
                  className="embla mt-5 overflow-hidden"
                >
                  <div className="embla__container flex gap-5">
                    {previewImageList.map((image, index) => (
                      <div
                        key={index}
                        className="embla__slide relative group shadow-md hover:shadow-lg transition-shadow flex-shrink-0 "
                      >
                        <img
                          src={image}
                          alt={`Hotel preview ${index}`}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                          <button
                            type="button"
                            onClick={(e) => {
                              if (!isLoading) {
                                e.stopPropagation();
                                deleteImage(index);
                              }
                            }}
                            className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                            aria-label="Xóa ảnh"
                            disabled={isLoading}
                          >
                            <Trash size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex mx-auto justify-center mt-10">
          <Button
            variant="contained"
            type="submit"
            size="large"
            disabled={isLoading}
            sx={{
              backgroundColor: isLoading ? "#9CA3AF" : "#3B82F6",
              borderRadius: "10px",
              "&:hover": {
                backgroundColor: isLoading ? "#9CA3AF" : "#2563EB",
              },
              width: { xs: "100%", sm: "20rem" },
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {isLoading && <CircularProgress size={20} color="inherit" />}{" "}
            {isLoading ? "Đang xử lý..." : "Đăng tải"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default HotelCreate;
