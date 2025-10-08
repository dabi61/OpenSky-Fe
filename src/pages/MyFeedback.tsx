import { useEffect, useState, type FC } from "react";
import { useFeedback } from "../contexts/FeedbackContext";
import useQueryState from "../hooks/useQueryState";
import Pagination from "../components/Pagination";
import { Card, CardContent, Typography, Box, Chip, Alert } from "@mui/material";
import { Hotel, MapPin, Star, MessageSquare } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import OverlayReload from "../components/Loading";
dayjs.locale("vi");

export const MyFeedback: FC = () => {
  const { myFeedbackList, getMyFeedback, loading } = useFeedback();
  const [page, setPage] = useQueryState("page", "1" as string);
  const [totalPages, setTotalPages] = useState(0);

  const fetchTours = async () => {
    try {
      const data = await getMyFeedback(Number(page), 20);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch feedback:", error);
    }
  };

  useEffect(() => {
    fetchTours();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage.toString());
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD/MM/YYYY • HH:mm");
  };

  if (loading) {
    return <OverlayReload />;
  }

  if (!myFeedbackList || myFeedbackList.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert severity="info" className="rounded-xl">
          <Typography variant="h6" className="flex items-center gap-2">
            <MessageSquare size={24} />
            Chưa có đánh giá nào
          </Typography>
          <Typography variant="body2" className="mt-2">
            Bạn chưa có đánh giá nào. Hãy trải nghiệm và để lại đánh giá cho các
            dịch vụ!
          </Typography>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl md:w-170 p-6">
      <div className="space-y-6 mb-8">
        {myFeedbackList.map((feedback) => (
          <Card
            key={feedback.feedbackId}
            className="shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl border border-gray-100"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Chip
                    icon={
                      feedback.type === "Hotel" ? (
                        <Hotel size={16} />
                      ) : (
                        <MapPin size={16} />
                      )
                    }
                    label={feedback.type === "Hotel" ? "Khách sạn" : "Tour"}
                    color={feedback.type === "Hotel" ? "primary" : "secondary"}
                    variant="outlined"
                    size="small"
                  />
                </div>
                <Typography variant="caption" className="text-gray-400">
                  {formatDate(feedback.createdAt)}
                </Typography>
              </div>

              <Typography
                variant="h6"
                className="font-semibold text-gray-900 mb-2 line-clamp-1"
              >
                {feedback.targetName}
              </Typography>

              <div className="flex items-center gap-3 mb-4">
                <Box className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < feedback.rate
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}

                  <Typography variant="body2" className="text-gray-600 ml-1">
                    ({feedback.rate}/5)
                  </Typography>
                </Box>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <Typography
                  variant="body2"
                  className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                >
                  {feedback.description}
                </Typography>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mb-8 flex justify-center">
          <Pagination
            page={Number(page)}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default MyFeedback;
