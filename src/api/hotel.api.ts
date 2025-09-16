import type { HotelResponse } from "../types/response/hotel";
import type { HotelCreateValidateType } from "../types/schemas/hotel.schema";
import axiosInstance from "../utils/AxisosInstance";
import { handleGetUser } from "./user.api";

export const handleCreateHotel = async (
  data: HotelCreateValidateType
): Promise<HotelResponse> => {
  try {
    const user = await handleGetUser();
    const formData = new FormData();
    formData.append("userId", user.userID);
    formData.append("email", data.email);
    formData.append("hotelName", data.hotelName);
    formData.append("address", data.address);
    formData.append("province", data.province);
    if (data.files && data.files.length > 0) {
      data.files.forEach((file) => {
        formData.append("files", file);
      });
    }
    if (data.description) {
      formData.append("description", data.description);
    }
    if (data.latitude && data.longitude) {
      formData.append("longitude", data.longitude.toString());
      formData.append("latitude", data.latitude.toString());
    }
    const res = await axiosInstance.post("hotels/apply", formData);
    return res.data;
  } catch (error: any) {
    return {
      message: error?.response?.data.message,
      hotelId: null,
    };
  }
};
