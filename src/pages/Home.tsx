import { InputAdornment, TextField } from "@mui/material";
import assets from "../assets";
import { Search } from "lucide-react";

function Home() {
  return (
    <div className=" bg-cover bg-center overflow-x-hidden">
      <div
        className="w-screen h-[calc(100vh-5rem)] flex flex-col justify-center items-center mx-auto my-auto"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 128, 255, 0.2), rgba(0, 128, 255, 0.2)), url(${assets.home_background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Nhập điểm du lịch hoặc tên khách sạn"
          className="bg-white rounded-2xl w-3/5 flex flex-col"
          size="medium"
          sx={{
            backgroundColor: "white",
            borderRadius: "1rem",
            paddingX: "0.5rem",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "none",
              },
              "&:hover fieldset": {
                border: "none",
              },
              "&.Mui-focused fieldset": {
                border: "none",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search className="w-5" />
              </InputAdornment>
            ),
          }}
        />
        <div className="text-white flex flex-col items-center gap-5">
          <div className="text-7xl font-bold my-10">OPENSKY</div>
          <div className="text-3xl font-bold">
            Khám phá thế giới cùng OpenSky
          </div>
          <div className="text-xl font-bold">
            Đặt phòng khách sạn, tour du lịch trong nước & quốc tế nhanh chóng -
            giá tốt mỗi ngày.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
