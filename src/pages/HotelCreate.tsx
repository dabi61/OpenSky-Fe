import { Button, TextField } from "@mui/material";
import { ChevronLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  HotelSchema,
  type HotelCreateValidateType,
} from "../types/schemas/hotel.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCoordinates } from "../api/geocode.api";
import { useState } from "react";
import { toast } from "sonner";

const HotelCreate = () => {
  const [coordinates, setCoordinates] = useState({ lon: 0, lat: 0 });
  const {
    watch,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<HotelCreateValidateType>({
    resolver: zodResolver(HotelSchema),
    mode: "onBlur",
  });

  const handleLoadLocation = async (address: string) => {
    const res = await getCoordinates(address);
    if (res) {
      setCoordinates({
        lat: res?.lat,
        lon: res?.lon,
      });
    } else {
      toast.error("Tọa độ này không khả dụng!");
    }
  };

  const onSubmit = (data: HotelCreateValidateType) => {
    console.log(data);
  };

  console.log(coordinates);

  return (
    <form className="w-6/7 mx-auto mt-10" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-2 items-center cursor-pointer">
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
            {...register("name")}
            label="Tên khách sạn"
            error={!!errors.name}
            helperText={errors.name?.message}
            InputLabelProps={{
              shrink: true,
              sx: {
                fontWeight: "bold",
                fontSize: "1.25rem",
                transform: "translate(14px, -9px) scale(0.8)",
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
                transform: "translate(14px, -9px) scale(0.8)",
                padding: "0 8px",
                marginLeft: "-8px",
              },
            }}
          />

          <Button
            variant="outlined"
            onClick={() => handleLoadLocation(watch("address"))}
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
                transform: "translate(14px, -9px) scale(0.8)",
                padding: "0 8px",
                marginLeft: "-8px",
              },
            }}
          />
        </div>
        <div className="flex mx-auto justify-center mt-10">
          <Button
            variant="contained"
            type="submit"
            size="large"
            sx={{
              backgroundColor: "#3B82F6",
              borderRadius: "10px",
              "&:hover": {
                backgroundColor: "#2563EB",
              },
              width: { xs: "100%", sm: "20rem" },
            }}
          >
            Đăng tải
          </Button>
        </div>
      </div>
    </form>
  );
};

export default HotelCreate;
