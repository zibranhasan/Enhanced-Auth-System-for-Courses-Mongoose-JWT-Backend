import { z } from "zod";

const createReviewValidationSchema = z.object({
  body: z.object({
    courseId: z.string({ required_error: "courseId is required" }),
    rating: z
      .number({ required_error: "rating is required" })
      .int()
      .min(1, { message: "rating must be at least 1" })
      .max(5, { message: "rating must be at most 5" }),
    review: z
      .string({ required_error: "review is required" })
      .min(1, { message: "review must have at least 1 character" }),
  }),
});

export const ReviewValidation = {
  createReviewValidationSchema,
};
