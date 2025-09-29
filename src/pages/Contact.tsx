import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Facebook, Youtube } from "lucide-react";

const Contact: React.FC = () => {
  const contactInfo = {
    phone: "0123.456.789",
    email: "contact@company.com",
    address: "1 Tràng Tiền, Hoàn Kiếm, Hà Nội, Việt Nam",
    workingHours: "Thứ 2 - Chủ Nhật: 8:00 - 22:00",
    facebook: "https://facebook.com/company",
    youtube: "https://youtube.com/company",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Liên Hệ</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng hỗ trợ và giải đáp mọi thắc mắc của bạn
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="text-blue-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Điện Thoại</h3>
            <p className="text-gray-600">{contactInfo.phone}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-green-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Email</h3>
            <p className="text-gray-600">{contactInfo.email}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-red-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Địa Chỉ</h3>
            <p className="text-gray-600">{contactInfo.address}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="text-purple-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Giờ Làm Việc</h3>
            <p className="text-gray-600">{contactInfo.workingHours}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-200 h-64 flex items-center justify-center">
              <iframe
                src="https://www.google.com/maps?q=1%20Tr%C3%A0ng%20Ti%E1%BB%81n%2C%20Ho%C3%A0n%20Ki%E1%BA%BFm%2C%20H%C3%A0%20N%E1%BB%99i%2C%20Vi%E1%BB%87t%20Nam&output=embed"
                className="w-full h-full"
                loading="lazy"
              ></iframe>
            </div>
            <div className="p-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                Vị Trí Của Chúng Tôi
              </h3>
              <p className="text-gray-600">{contactInfo.address}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-800 mb-6 text-center text-xl">
              Theo Dõi Chúng Tôi
            </h3>
            <div className="flex justify-center space-x-6">
              <a
                href={contactInfo.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                <Facebook size={24} />
              </a>
              <a
                href={contactInfo.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                <Youtube size={24} />
              </a>
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Kết nối với chúng tôi qua mạng xã hội để cập nhật những thông
                tin mới nhất
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-12 bg-blue-50 rounded-lg p-8 text-center"
        >
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Cần Hỗ Trợ Thêm?
          </h3>
          <p className="text-gray-600 mb-4">
            Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi
            qua các thông tin trên.
          </p>
          <p className="text-gray-500">
            Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn!
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
