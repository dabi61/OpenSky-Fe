import { useNavigate, useParams } from "react-router-dom";
import { useHotel } from "../contexts/HotelContext";
import { useEffect, useState } from "react";
import OverlayReload from "../components/Loading";
import {
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  Typography,
  InputAdornment,
} from "@mui/material";
import {
  MapPin,
  Camera,
  Save,
  Mail,
  User,
  Calendar,
  ChevronLeft,
  MapPinned,
} from "lucide-react";

const HotelEdit: React.FC = () => {
  const { getHotelById, selectedHotel, loading } = useHotel();
  const { id } = useParams();
  const navigate = useNavigate();

  console.log(selectedHotel);

  const [hotelData, setHotelData] = useState({
    hotelName: "",
    email: "",
    address: "",
    province: "",
    lon: 0,
    lat: 0,
    description: "",
    star: 0,
    status: "Active",
  });

  const fetchHotel = async () => {
    try {
      if (id) {
        await getHotelById(id);
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

  console.log(coordinates);

  useEffect(() => {
    if (selectedHotel) {
      setHotelData({
        hotelName: selectedHotel.hotelName || "",
        email: selectedHotel.email || "",
        address: selectedHotel.address || "",
        province: selectedHotel.province || "",
        lon: selectedHotel.longitude || 0,
        lat: selectedHotel.latitude || 0,
        description: selectedHotel.description || "",
        star: selectedHotel.star || 0,
        status: selectedHotel.status || "Active",
      });
    }
  }, [selectedHotel]);

  if (loading) {
    return <OverlayReload />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 cursor-pointer">
            <div
              className="bg-blue-500 rounded-full p-1"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft color="white" size={20} />
            </div>
            <div className="font-semibold">Quay lại</div>
          </div>
        </div>
        <Button
          variant="contained"
          startIcon={<Save size={20} />}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Lưu thay đổi
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3">
          <Paper elevation={2} className="p-6 mb-6">
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
                value={hotelData.hotelName}
                onChange={(e) =>
                  setHotelData({ ...hotelData, hotelName: e.target.value })
                }
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={hotelData.email}
                onChange={(e) =>
                  setHotelData({ ...hotelData, email: e.target.value })
                }
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

            <Divider className="my-4" />

            <Typography
              variant="h6"
              className="font-semibold mb-4 flex items-center gap-2"
            >
              <MapPin size={20} />
              Địa chỉ
            </Typography>

            <div className="flex flex-col gap-4 mb-4 mt-3">
              <div className="flex gap-2">
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  value={hotelData.address}
                  onChange={(e) =>
                    setHotelData({ ...hotelData, address: e.target.value })
                  }
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MapPin size={18} className="text-gray-500" />
                      </InputAdornment>
                    ),
                  }}
                />
                <button className="border border-gray-400 rounded-md px-4 text-gray-500 hover:text-gray-600 cursor-pointer">
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

            <Divider className="my-4" />

            <Divider className="my-4" />

            <Typography variant="h6" className="font-semibold mb-4 ">
              Thông tin bổ sung
            </Typography>

            <div className="flex flex-col md:flex-row gap-4 mb-4 mt-3">
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={hotelData.status}
                  label="Trạng thái"
                  onChange={(e) =>
                    setHotelData({ ...hotelData, status: e.target.value })
                  }
                >
                  <MenuItem value="Active">Hoạt động</MenuItem>
                  <MenuItem value="Inactive">Ngừng hoạt động</MenuItem>
                  <MenuItem value="Suspend">Tạm ngưng</MenuItem>
                  <MenuItem value="Removed">Đã xóa</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Ngày tạo"
                value={
                  selectedHotel
                    ? new Date(selectedHotel.createdAt).toLocaleDateString(
                        "vi-VN"
                      )
                    : ""
                }
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Calendar size={18} className="text-gray-500" />
                    </InputAdornment>
                  ),
                }}
                disabled
              />
            </div>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Mô tả"
              value={hotelData.description}
              onChange={(e) =>
                setHotelData({ ...hotelData, description: e.target.value })
              }
              variant="outlined"
            />
          </Paper>
        </div>

        {/* Right Column - Image Upload and Preview */}
        <div className="w-full lg:w-1/3">
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
                <input type="file" hidden accept="image/*" multiple />
              </Button>
            </div>

            <div className="flex gap-2 mt-4">
              {selectedHotel?.images?.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img}
                    alt={`Hotel image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-md transition-opacity">
                    <Button size="small" color="error" variant="contained">
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

          {/* User Information */}
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
        </div>
      </div>
    </div>
  );
};

export default HotelEdit;
