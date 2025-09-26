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
} from "@mui/material";
import { X as CloseIcon, ShoppingCart as ShoppingCartIcon } from "lucide-react";
import { useBookingRoom } from "../contexts/BookingRoomContext";

const RoomStackBooking: FC = () => {
  const [open, setOpen] = useState(false);
  const { bookingRoomList, removeToBookingList } = useBookingRoom();

  const toggleDrawer = (state: boolean) => () => setOpen(state);

  return (
    <>
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
          sx={{ width: 320, p: 2, display: "flex", flexDirection: "column" }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">Giỏ phòng</Typography>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List>
            {bookingRoomList.length === 0 && (
              <Typography sx={{ mt: 2 }}>Chưa có phòng nào</Typography>
            )}
            {bookingRoomList.map((room) => (
              <ListItem
                key={room.roomID}
                secondaryAction={
                  <Button
                    color="error"
                    size="small"
                    onClick={() => removeToBookingList(room.roomID)}
                  >
                    Xoá
                  </Button>
                }
              >
                <ListItemText
                  primary={room.roomName}
                  secondary={`Giá: ${room.price}đ`}
                />
              </ListItem>
            ))}
          </List>

          {bookingRoomList.length > 0 && (
            <Box sx={{ mt: "auto", pt: 2 }}>
              <Typography variant="subtitle1">
                Tổng tiền:{" "}
                {bookingRoomList
                  .reduce((sum, r) => sum + r.price, 0)
                  .toLocaleString()}
                VNĐ
              </Typography>
              <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                Đặt phòng
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default RoomStackBooking;
