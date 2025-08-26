import { BadgeDollarSign, Handshake, Map } from "lucide-react";

export const homeDescriptions = [
  {
    title: "Giá tốt - Minh bạch",
    description:
      "OpenSky mang đến mức giá cạnh tranh, hiển thj rõ ràng.Khách hàng dễ dàng so sánh và chọn lựa phù hợp với ngân sách",
    img: <BadgeDollarSign size={80} className="text-blue-500" />,
  },
  {
    title: "Hành trình đa dạng, Điểm đến hẫn dẫn",
    description:
      "OpenSky liên tục cung cấp những hành trình và những khách sạn hot nhất",
    img: <Map size={60} className="text-blue-500" />,
  },
  {
    title: "Đặt chỗ dễ dàng - Hỗ trợ tận tâm",
    description:
      "Website thân thiện, thao tác đặt chỗ nhanh chóng. Đỗi ngũ tư vấn viên luôn sẵn sàng 24/7",
    img: <Handshake size={60} className="text-blue-500" />,
  },
];
