import { useState, type FC } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  Fab,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  X as CloseIcon,
  ShoppingCart as ShoppingCartIcon,
  Calendar,
  Moon,
} from "lucide-react";
import { useBookingRoom } from "../contexts/BookingRoomContext";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const RoomStackBooking: FC = () => {
  const [open, setOpen] = useState(false);
  const { roomBill, removeRoom, setCheckInDate, setNumberOfNights } =
    useBookingRoom();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const nightOptions = Array.from({ length: 30 }, (_, i) => i + 1);

  const toggleDrawer = (state: boolean) => () => setOpen(state);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCheckInDate(new Date(value));

    const minDate = dayjs().add(3, "day");
    const maxDate = dayjs().add(3, "year");

    if (!value) {
      setError("Vui lòng chọn ngày nhận phòng");
    } else if (dayjs(value).isBefore(minDate, "day")) {
      setError("Ngày nhận phòng phải sau hôm nay ít nhất 3 ngày");
    } else if (dayjs(value).isAfter(maxDate, "day")) {
      setError(`Năm không phù hợp`);
    } else {
      setError("");
    }
  };

  return (
    <div>
      <Fab
        color="primary"
        aria-label="cart"
        onClick={toggleDrawer(true)}
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        <ShoppingCartIcon />
      </Fab>

      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 320,
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">Phòng</Typography>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              mt: 2,
              mb: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Calendar size={18} />
              <Typography variant="subtitle2">Ngày nhận phòng</Typography>
            </Box>
            <TextField
              type="date"
              value={
                roomBill.checkInDate
                  ? dayjs(roomBill.checkInDate).format("YYYY-MM-DD")
                  : ""
              }
              onChange={handleChange}
              size="small"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: dayjs().add(3, "day").format("YYYY-MM-DD"),
              }}
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Moon size={18} />
              <Typography variant="subtitle2">Số đêm</Typography>
            </Box>
            <FormControl fullWidth size="small">
              <InputLabel>Số đêm</InputLabel>
              <Select
                size="small"
                value={roomBill.numberOfNights}
                onChange={(e) => setNumberOfNights(Number(e.target.value))}
                label="Số đêm"
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 200,
                    },
                  },
                }}
              >
                {nightOptions.map((nights) => (
                  <MenuItem key={nights} value={nights}>
                    {nights} đêm
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <List sx={{ flexGrow: 1, overflow: "auto" }}>
            {roomBill.roomList.length === 0 && (
              <Typography sx={{ mt: 2, textAlign: "center" }}>
                Chưa có phòng nào
              </Typography>
            )}
            {roomBill.roomList.map((room) => {
              const roomTotalPrice = room.price * roomBill.numberOfNights;

              return (
                <ListItem
                  className="hover:bg-blue-100 cursor-pointer"
                  key={room.roomID}
                  onClick={() => navigate(`/room_info/${room.roomID}`)}
                  secondaryAction={
                    <Button
                      color="error"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRoom(room.roomID);
                      }}
                    >
                      XÓA
                    </Button>
                  }
                >
                  <ListItemText
                    primary={room.roomName}
                    secondary={
                      <Typography component="div" variant="body2">
                        <div>
                          Giá/đêm:{" "}
                          {Intl.NumberFormat("vi-VN").format(room.price)} VNĐ
                        </div>
                        <div>
                          Tổng:{" "}
                          {Intl.NumberFormat("vi-VN").format(roomTotalPrice)}{" "}
                          VNĐ
                          {roomBill.numberOfNights > 1 &&
                            ` (${roomBill.numberOfNights} đêm)`}
                        </div>
                      </Typography>
                    }
                  />
                </ListItem>
              );
            })}
          </List>

          {roomBill && (
            <Box sx={{ mt: "auto", pt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Tổng tiền{" "}
                {roomBill.numberOfNights > 1 &&
                  `(${roomBill.numberOfNights} đêm)`}
                :
              </Typography>

              <Typography
                variant="h6"
                component="div"
                fontWeight="bold"
                color="primary"
                sx={{ mb: 2 }}
              >
                {Intl.NumberFormat("vi-VN").format(roomBill.totalPrice)} VNĐ
              </Typography>

              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                disabled={
                  !roomBill.checkInDate ||
                  !!error ||
                  roomBill.roomList.length === 0
                }
                onClick={() => {
                  navigate("/booking", { state: roomBill });
                }}
              >
                {roomBill.checkInDate ? "Đặt phòng" : "Chọn ngày nhận phòng"}
              </Button>

              {error && (
                <Typography
                  variant="body2"
                  color="error"
                  sx={{ mt: 1, textAlign: "center" }}
                >
                  {error}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Drawer>
    </div>
  );
};

export default RoomStackBooking;
