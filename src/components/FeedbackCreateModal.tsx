import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Rating,
  Box,
  Typography,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { Star } from "lucide-react";
import Modal from "./Modal";
import {
  FeedbackSchema,
  type FeedbackCreateType,
} from "../types/schemas/feedback.schema";
import { handleCreateFeedback } from "../api/feedback.api";
import { toast } from "sonner";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "Tour" | "Hotel";
  targetId: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  type,
  targetId,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<FeedbackCreateType>({
    resolver: zodResolver(FeedbackSchema),
    defaultValues: {
      type,
      targetId,
      description: "",
      rate: 0,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const descriptionValue = watch("description");
  const rateValue = watch("rate");

  const handleFormSubmit = async (data: FeedbackCreateType) => {
    console.log(data);
    const res = await handleCreateFeedback(data);
    console.log(res);
    if (res.reviewId) {
      toast.success(res.message);
      reset();
      onClose();
    } else {
      toast.error(res.message);
      reset();
      onClose();
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const customStarIcon = <Star size={32} style={{ fill: "currentColor" }} />;
  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Đánh giá của bạn">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle>
          <Typography variant="body2" color="text.secondary">
            Chia sẻ trải nghiệm của bạn về{" "}
            {type === "Tour" ? "tour" : "khách sạn"} này
          </Typography>
        </DialogTitle>
        <DialogContent>
          <div className="flex mb-5 justify-center">
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Rating
                value={rateValue}
                onChange={(_, newValue) =>
                  setValue("rate", Number(newValue) || 0, {
                    shouldValidate: true,
                  })
                }
                icon={customStarIcon}
                emptyIcon={customStarIcon}
                size="large"
              />
            </Box>
            {errors.rate && (
              <FormHelperText error>{errors.rate.message}</FormHelperText>
            )}
          </div>

          <Box sx={{ mb: 2 }}>
            <TextField
              {...register("description")}
              label="Nội dung đánh giá *"
              multiline
              rows={4}
              fullWidth
              error={!!errors.description}
              inputProps={{ maxLength: 500 }}
              helperText={
                errors.description
                  ? errors.description.message
                  : `${descriptionValue.length}/500 ký tự`
              }
              placeholder={`Hãy chia sẻ trải nghiệm của bạn về ${
                type === "Tour" ? "tour" : "khách sạn"
              } này...`}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!isValid || isSubmitting}
            startIcon={isSubmitting && <CircularProgress size={16} />}
          >
            {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
          </Button>
        </DialogActions>
      </form>
    </Modal>
  );
};

export default FeedbackModal;
