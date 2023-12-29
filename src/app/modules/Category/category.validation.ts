import { z } from "zod";

const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: "Category  must be string",
      required_error: "Name is required",
    }),
  }),
});

export const CategoryValidation = {
  createCategoryValidationSchema,
};
