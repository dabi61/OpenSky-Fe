import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import assets from "../assets";

const Login: React.FC = () => {
  return (
    <div className="flex-1 w-full bg-gradient-to-r from-blue-100 via-blue-300 to-blue-500 flex items-center justify-center">
      <div className="rounded-3xl bg-white flex md:w-200">
        <div className="sm:flex-1 w-full flex flex-col my-auto items-center p-5">
          <div className="text-2xl font-bold h-20 flex justify-center items-center">
            Đăng nhập
          </div>
          <div className="flex flex-col gap-2 w-full h-full">
            <div className="h-18">
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                size="small"
                margin="normal"
                className="flex "
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <div className="h-18">
              <TextField
                label="Mật khẩu"
                fullWidth
                size="small"
                margin="normal"
                type="password"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <div className="flex items-center justify-between text-[0.8rem] w-full">
              <FormControlLabel
                control={<Checkbox />}
                label="Ghi nhớ mật khẩu"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: "0.875rem",
                  },
                }}
              />
              <div>Quên mật khẩu ?</div>
            </div>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#3B82F6",
                "&:hover": {
                  backgroundColor: "#2563EB",
                },
              }}
            >
              Đăng nhập
            </Button>
            <div className="text-sm flex flex-col justify-center items-center gap-2">
              <p>Hoặc đăng nhập với</p>
              <img className="w-10 cursor-pointer" src={assets.google} />
              <p>
                Bạn chưa có tài khoản ?{" "}
                <span className="text-blue-400">Đăng ký</span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 w-full overflow-hidden rounded-r-3xl">
          <img
            src={assets.home}
            className="w-full h-125 rounded-l-[100px] object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
