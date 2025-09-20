import { useEffect, type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTour } from "../contexts/TourContext";
import OverlayReload from "../components/Loading";
import { Paper, TextField, Button, Divider, Typography } from "@mui/material";
import {
  MapPin,
  Users,
  DollarSign,
  Camera,
  Save,
  ChevronLeft,
} from "lucide-react";

const TourEdit: FC = () => {
  const { id } = useParams();
  const { getTourById, selectedTour, loading } = useTour();
  const navigate = useNavigate();
  const fetchTour = async () => {
    try {
      if (id) {
        await getTourById(id);
      }
    } catch (error) {
      console.error("Failed to fetch tourList:", error);
    }
  };

  useEffect(() => {
    fetchTour();
  }, []);

  if (loading) {
    return <OverlayReload />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen w-6/7 mx-auto">
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
        >
          Lưu thay đổi
        </Button>
      </div>

      <div className="grid grid-cols-1  gap-6">
        <div className="lg:col-span-2">
          <Paper elevation={2} className="p-6 mb-6">
            <Typography variant="h6" className="font-semibold mb-4">
              Thông tin cơ bản
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-3">
              <TextField
                fullWidth
                label="Tên tour"
                value={selectedTour?.tourName || ""}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Địa chỉ"
                value={selectedTour?.address || ""}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <MapPin size={18} className="mr-2 text-gray-500" />
                  ),
                }}
              />
            </div>

            <Divider className="my-4" />

            <Typography variant="h6" className="font-semibold mb-4">
              Thông tin giá và sức chứa
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-3">
              <TextField
                fullWidth
                label="Giá tour"
                type="number"
                value={selectedTour?.price || 0}
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
                value={selectedTour?.maxPeople || 0}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <Users size={18} className="mr-2 text-gray-500" />
                  ),
                }}
              />
            </div>

            <Divider className="my-4" />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Mô tả tour"
              value={selectedTour?.description || ""}
              variant="outlined"
              className="mb-4"
            />
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
                    src={img}
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
    </div>
  );
};

export default TourEdit;
