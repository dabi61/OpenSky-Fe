import z from "zod";

export const TourItinerarySchema = z.object({
  tourID: z.uuid().nonempty("Hiện tại chưa có tourID"),
  dayNumber: z
    .number()
    .refine((val) => !isNaN(val), { message: "Vui lòng nhập số ngày" })
    .min(1, "Vui lòng nhập số ngày"),
  location: z.string().nonempty("Vui lòng nhập vị trí"),
  description: z.string().nullable(),
});
export type TourItineraryValidateType = z.infer<typeof TourItinerarySchema>;
