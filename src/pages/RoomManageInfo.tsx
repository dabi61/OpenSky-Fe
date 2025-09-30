import { Button, TextField, CircularProgress } from "@mui/material";
import { ChevronLeft, CloudUpload, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useImage } from "../contexts/ImageContext";
import useEmblaCarousel from "embla-carousel-react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  RoomSchema,
  RoomUpdateSchema,
  type RoomCreateValidateType,
  type RoomupdateValidateType,
} from "../types/schemas/room.schema";
import { handleCreateRoom, handleUpdateRoom } from "../api/hotelRoom.api";
import { useHotel } from "../contexts/HotelContext";
import { useRoom } from "../contexts/RoomContext";

const RoomManageInfo = () => {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();
  const { id } = useParams();
  const { getRoomById, selectedRoom } = useRoom();
  const [isLoading, setIsLoading] = useState(false);
  const [emblaRefImages] = useEmblaCarousel({ axis: "x", dragFree: true });
  const { imageList, addImageList, deleteImage, previewImageList } = useImage();
  const [deleteImgIds, setDeleteImgIds] = useState<number[]>([]);
  const { getMyHotel } = useHotel();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RoomCreateValidateType | RoomupdateValidateType>({
    resolver: zodResolver(id ? RoomUpdateSchema : RoomSchema),
    mode: "onBlur",
  });

  setValue("deleteImageIds", deleteImgIds);
  setValue("files", imageList);

  const fetchRoom = async () => {
    try {
      if (id) {
        await getRoomById(id);
      }
    } catch (error) {
      console.error("Failed to fetch hotel:", error);
    }
  };

  useEffect(() => {
    fetchRoom();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      reset({
        address: selectedRoom.address || "",
        maxPeople: selectedRoom.maxPeople || 0,
        price: selectedRoom.price || 0,
        roomName: selectedRoom.roomName || "",
        roomType: selectedRoom.roomType || "",
      });
    } else {
      reset({
        address: "",
        maxPeople: 0,
        price: 0,
        roomName: "",
        roomType: "",
      });
    }
  }, [selectedRoom, reset]);

  const onCreateSubmit = async (data: RoomCreateValidateType) => {
    const currentHotel = await getMyHotel();

    const res = await handleCreateRoom(data, currentHotel.hotelID);
    if (res.roomID) {
      toast.success(res.message);
      navigate("/my_hotel/room_manage");
    } else {
      toast.error(res.message);
    }
  };

  const onUpdateSubmit = async (data: RoomupdateValidateType) => {
    const res = await handleUpdateRoom(data, id!);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  const onSubmit = async (
    data: RoomupdateValidateType | RoomCreateValidateType
  ) => {
    if (id) {
      await onUpdateSubmit(data as RoomupdateValidateType);
    } else {
      await onCreateSubmit(data as RoomCreateValidateType);
    }
  };

  const submitForm = async () => {
    setIsLoading(true);

    try {
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
      className="w-full max-w-7xl mx-auto mt-4 md:mt-10 px-4 sm:px-6 lg:px-8"
      onSubmit={(e) => {
        e.preventDefault();
        submitForm();
      }}
    >
      <div
        className="flex gap-2 items-center cursor-pointer mb-4 md:mb-0"
        onClick={() => navigate(-1)}
      >
        <div className="bg-blue-500 rounded-full p-1">
          <ChevronLeft color="white" size={20} />
        </div>
        <div className="font-semibold text-sm md:text-base">Quay lại</div>
      </div>
      <div className="border rounded-2xl p-4 md:p-6 lg:p-10 mt-4 md:mt-5 border-blue-500">
        <div className="font-semibold flex justify-center text-xl md:text-2xl mb-6 md:mb-10">
          Thông tin phòng
        </div>
        <div className="px-0 sm:px-4 md:px-10 lg:px-20 flex flex-col gap-6 md:gap-8 lg:gap-10">
          <TextField
            fullWidth
            variant="outlined"
            label="Tên phòng"
            {...register("roomName")}
            error={!!errors.roomName}
            helperText={errors.roomName?.message || " "}
            InputLabelProps={{
              shrink: true,
              sx: {
                fontWeight: "bold",
                fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" },
                transform: "translate(14px, -9px) scale(0.8)",
                backgroundColor: "white",
                padding: "0 8px",
                marginLeft: "-8px",
              },
            }}
          />
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 xl:gap-20">
            <TextField
              fullWidth
              variant="outlined"
              label="Nhập giá"
              type="number"
              {...register("price", { valueAsNumber: true })}
              error={!!errors.price}
              helperText={errors.price?.message || " "}
              InputLabelProps={{
                shrink: true,
                sx: {
                  fontWeight: "bold",
                  fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" },
                  backgroundColor: "white",
                  transform: "translate(14px, -9px) scale(0.8)",
                  padding: "0 8px",
                  marginLeft: "-8px",
                },
              }}
              InputProps={{
                inputProps: { min: 0 },
                sx: {
                  "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button":
                    {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                  "input[type=number]": {
                    MozAppearance: "textfield",
                  },
                },
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Nhập số lượng người"
              {...register("maxPeople", { valueAsNumber: true })}
              type="number"
              error={!!errors.maxPeople}
              helperText={errors.maxPeople?.message || " "}
              InputLabelProps={{
                shrink: true,
                sx: {
                  fontWeight: "bold",
                  fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" },
                  backgroundColor: "white",
                  transform: "translate(14px, -9px) scale(0.8)",
                  padding: "0 8px",
                  marginLeft: "-8px",
                },
              }}
              InputProps={{
                inputProps: { min: 0 },
                sx: {
                  "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button":
                    {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                  "input[type=number]": {
                    MozAppearance: "textfield",
                  },
                },
              }}
            />

            <TextField
              fullWidth
              variant="outlined"
              label="Loại phòng"
              {...register("roomType")}
              error={!!errors.roomType}
              helperText={errors.roomType?.message || " "}
              InputLabelProps={{
                shrink: true,
                sx: {
                  fontWeight: "bold",
                  fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" },
                  transform: "translate(14px, -9px) scale(0.8)",
                  backgroundColor: "white",
                  padding: "0 8px",
                  marginLeft: "-8px",
                },
              }}
            />
          </div>

          <TextField
            fullWidth
            variant="outlined"
            label="Vị trí"
            {...register("address")}
            error={!!errors.address}
            helperText={errors.address?.message || " "}
            InputLabelProps={{
              shrink: true,
              sx: {
                fontWeight: "bold",
                fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" },
                backgroundColor: "white",
                transform: "translate(14px, -9px) scale(0.8)",
                padding: "0 8px",
                marginLeft: "-8px",
              },
            }}
          />

          <div>
            <div className="mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md">
              <div className="font-bold text-gray-600 mb-4 text-lg md:text-xl">
                Ảnh
              </div>

              <div
                className={`border-2 border-dashed rounded-lg p-4 md:p-6 lg:p-8 text-center cursor-pointer transition-colors mb-4 md:mb-6 border-gray-300 hover:border-blue-400 ${
                  isLoading ? "opacity-50 pointer-events-none" : " "
                }`}
                onClick={() => {
                  if (!isLoading && fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
              >
                <div className="flex flex-col items-center justify-center">
                  <CloudUpload size={40} color="gray" />
                  <p className="text-gray-600 mt-2 md:mt-3 text-sm md:text-base">
                    Nhấp để tải ảnh lên hoặc kéo thả ảnh vào đây
                  </p>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">
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

              {(imageList.length > 0 || selectedRoom?.images) && (
                <div
                  ref={emblaRefImages}
                  className="embla mt-4 md:mt-5 overflow-hidden"
                >
                  <div className="embla__container flex gap-3 md:gap-4 lg:gap-5">
                    {selectedRoom &&
                      selectedRoom.images
                        .filter((img) => !deleteImgIds.includes(img.imageId))
                        .map((image) => (
                          <div
                            key={image.imageId}
                            className="embla__slide relative group shadow-md hover:shadow-lg transition-shadow flex-shrink-0 w-32 h-24 md:w-40 md:h-32 lg:w-48 lg:h-40"
                          >
                            <img
                              src={image.imageUrl}
                              alt={`Hotel preview ${image.imageId}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/50 bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                              <button
                                type="button"
                                onClick={(e) => {
                                  if (!isLoading) {
                                    e.stopPropagation();
                                    setDeleteImgIds((prev) => [
                                      ...prev,
                                      image.imageId,
                                    ]);
                                  }
                                }}
                                className="p-1 md:p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                                aria-label="Xóa ảnh"
                                disabled={isLoading}
                              >
                                <Trash size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                    {previewImageList.map((image, index) => (
                      <div
                        key={index}
                        className="embla__slide relative group shadow-md hover:shadow-lg transition-shadow flex-shrink-0 w-32 h-24 md:w-40 md:h-32 lg:w-48 lg:h-40"
                      >
                        <img
                          src={image}
                          alt={`Hotel preview ${index}`}
                          className="w-full h-full object-cover rounded-lg"
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
                            className="p-1 md:p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                            aria-label="Xóa ảnh"
                            disabled={isLoading}
                          >
                            <Trash size={16} />
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
        <div className="flex mx-auto justify-center mt-6 md:mt-8 lg:mt-10">
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
              width: { xs: "100%", sm: "16rem", md: "20rem" },
              display: "flex",
              alignItems: "center",
              gap: "8px",
              py: { xs: 1.5, md: 2 },
              fontSize: { xs: "0.875rem", md: "1rem" },
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

export default RoomManageInfo;
