import axios from "axios";

export const getProvinces = async () => {
  try {
    const res = await axios.get("https://vapi.vnappmob.com/api/v2/province/");
    return res.data.results.map((p: any) => {
      return {
        province_id: p.province_id,
        province_name: p.province_name.replace(/^Tỉnh\s|^Thành phố\s/, ""),
      };
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tỉnh:", error);
    return [];
  }
};
