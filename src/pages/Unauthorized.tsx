import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button, Container, Typography, Box } from "@mui/material";
import { ChevronLeft, Home } from "lucide-react";

const Unauthorized = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User tried to access", location.pathname);
  }, [location]);

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          padding: 3,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "8rem", md: "12rem" },
            fontWeight: "bold",
            background: "linear-gradient(45deg, #f44336 30%, #ff9800 90%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            lineHeight: 1,
            marginBottom: 2,
          }}
        >
          404
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            marginBottom: 2,
            color: "text.primary",
          }}
        >
          Trang không tồn tại
        </Typography>

        <Typography
          variant="body1"
          sx={{
            marginBottom: 4,
            color: "text.secondary",
            maxWidth: "400px",
          }}
        >
          Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm. Có thể
          địa chỉ URL không chính xác hoặc trang đã bị di chuyển.
        </Typography>

        {/* Nút hành động */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<ChevronLeft />}
            onClick={() => window.history.back()}
            sx={{
              borderRadius: "8px",
              padding: "10px 20px",
            }}
          >
            Quay lại
          </Button>

          <Button
            variant="outlined"
            size="large"
            component={Link}
            to="/"
            startIcon={<Home />}
            sx={{
              borderRadius: "8px",
              padding: "10px 20px",
            }}
          >
            Về trang chủ
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Unauthorized;
