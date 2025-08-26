import assets from "../assets";

function Footer() {
  return (
    <div className="w-screen flex h-95 bg-blue-400 text-white pt-10">
      <div className="w-2/6 flex flex-col gap-2 relative items-center">
        <img src={assets.ligt_logo} className="w-[96px] mt-10" />
        <div className="font-sans text-sm absolute bottom-20">
          @2025 All Right Reserved
        </div>
      </div>

      <div className="w-3/5 flex justify-between font-sans px-8 py-6">
        <div>
          <p className="font-bold mb-10 ">Sản phẩm</p>
          <div className="flex flex-col gap-3 font-light">
            <div className="cursor-pointer hover:underline">Khách sạn</div>
            <div className="cursor-pointer hover:underline">Tour du lịch</div>
          </div>
        </div>

        <div>
          <p className="font-bold mb-10 ">Về OpenSky</p>
          <div className="flex flex-col gap-3 font-light">
            <div className="cursor-pointer hover:underline">Cách đặt tour</div>
            <div className="cursor-pointer hover:underline">
              Liên hệ chúng tôi
            </div>
            <div className="cursor-pointer hover:underline">Trợ giảng</div>
            <div className="cursor-pointer hover:underline">Tuyển dụng</div>
          </div>
        </div>

        <div>
          <p className="font-bold mb-10 ">Trợ giúp</p>
          <div className="flex flex-col gap-3 font-light">
            <div className="cursor-pointer hover:underline">
              Trung tâm trợ giúp
            </div>
            <div className="cursor-pointer hover:underline">
              Câu hỏi thường gặp
            </div>
            <div className="cursor-pointer hover:underline">
              Điều khoản sử dụng
            </div>
            <div className="cursor-pointer hover:underline">
              Quản lý thiết lập cookie
            </div>
            <div className="cursor-pointer hover:underline">
              Chính sách bảo mật
            </div>
            <div className="cursor-pointer hover:underline">
              Đạo luật dịch vụ số
            </div>
          </div>
        </div>

        <div>
          <p className="font-bold mb-10 ">Theo dõi chúng tôi</p>
          <div className="flex flex-col gap-3 font-light">
            <div className="flex gap-2 items-center cursor-pointer hover:underline">
              <img className="w-4 h-4" src={assets.instagram} /> Instagram
            </div>
            <div className="flex gap-2 items-center cursor-pointer hover:underline">
              <img className="w-4 h-4" src={assets.facebook} /> Facebook
            </div>
            <div className="flex gap-2 items-center cursor-pointer hover:underline">
              <img className="w-4 h-4" src={assets.tiktok} /> Tiktok
            </div>
            <div className="flex gap-2 items-center cursor-pointer hover:underline">
              <img className="w-4 h-4" src={assets.youtube} /> Youtube
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
