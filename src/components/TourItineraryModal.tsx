import { useEffect, type FC } from "react";
import type { TourItineraryType } from "../types/response/tour_itinerary.type";
import Modal from "./Modal";
import { Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import {
  TourItinerarySchema,
  TourItineraryUpdateSchema,
  type TourItineraryUpdateValidateType,
  type TourItineraryValidateType,
} from "../types/schemas/tour_itinerary.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  handleCreateTourItinerary,
  handleUpdateTourItinerary,
} from "../api/tourItinerary.api";
import { toast } from "sonner";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: TourItineraryType | null;
  tourId: string;
  onSuccess?: () => void;
}

const TourItineraryModal: FC<ModalProps> = ({
  isOpen,
  onClose,
  data,
  tourId,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TourItineraryUpdateValidateType | TourItineraryValidateType>({
    resolver: zodResolver(
      data ? TourItineraryUpdateSchema : TourItinerarySchema
    ),
    mode: "onBlur",
    defaultValues: data
      ? {
          tourID: tourId,
          dayNumber: data.dayNumber,
          description: data.description,
          location: data.location,
        }
      : {
          tourID: tourId,
          dayNumber: 0,
          description: "",
          location: "",
        },
  });

  useEffect(() => {
    if (data) {
      reset({
        tourID: tourId,
        dayNumber: data?.dayNumber || 0,
        description: data?.description || "",
        location: data?.location || "",
      });
    } else {
      reset({
        tourID: tourId,
        dayNumber: 0,
        description: "",
        location: "",
      });
    }
  }, [data, reset]);

  const onCreateSubmit = async (formData: TourItineraryValidateType) => {
    const res = await handleCreateTourItinerary(formData);
    if (res.itineraryId) {
      toast.success(res.message);
      onSuccess?.();
      onClose();
    } else {
      toast.error(res.message);
    }
  };

  const onUpdateSubmit = async (formData: TourItineraryUpdateValidateType) => {
    if (!data?.itineraryID) return;
    const res = await handleUpdateTourItinerary(data.itineraryID, formData);
    if (res.success) {
      toast.success(res.message);
      onSuccess?.();
      onClose();
    } else {
      toast.error(res.message);
    }
  };

  const onSubmit = (
    formData: TourItineraryValidateType | TourItineraryUpdateValidateType
  ) => {
    if (data) {
      onUpdateSubmit(formData as TourItineraryUpdateValidateType);
    } else {
      onCreateSubmit(formData as TourItineraryValidateType);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      reset={() => reset()}
      title={data ? "Thông tin lịch trình" : "Thêm lịch trình"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
        <div className="flex gap-5">
          <TextField
            label="Điểm đến"
            variant="outlined"
            fullWidth
            {...register("location")}
            error={!!errors.location}
            helperText={errors.location?.message || " "}
            size="small"
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Ngày ở lại"
            variant="outlined"
            fullWidth
            size="small"
            type="number"
            {...register("dayNumber", { valueAsNumber: true })}
            error={!!errors.dayNumber}
            helperText={errors.dayNumber?.message || " "}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <TextField
          label="Mô tả"
          fullWidth
          size="small"
          {...register("description")}
          error={!!errors.description}
          helperText={errors.description?.message || " "}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <div className="flex mx-auto justify-center">
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#3B82F6",
              "&:hover": {
                backgroundColor: "#2563EB",
              },
            }}
          >
            Lưu
          </Button>
        </div>
      </form>
    </Modal>
  );
};
export default TourItineraryModal;
