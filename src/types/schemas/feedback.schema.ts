import z from "zod";

export const FeedbackSchema = z.object({
  type: z.enum(["Tour", "Hotel"]),
  targetId: z.string().uuid({
    message: "targetId phải là UUID hợp lệ",
  }),
  description: z.string().nonempty("Vui lòng nhập đánh giá của bạn"),
  rate: z
    .number({
      error: () => {
        return "Số sao không phù hợp";
      },
    })
    .min(1, "Số sao không hợp lệ")
    .max(5, "Số sao không hợp lệ"),
});

export type FeedbackCreateType = z.infer<typeof FeedbackSchema>;
