import axios from "axios";
import type { Province } from "../types/api/province";

export const getProvinces = async (): Promise<Province[]> => {
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
