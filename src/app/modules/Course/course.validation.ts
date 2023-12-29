import { z } from "zod";

const tagSchema = z.object({
  name: z.string({ required_error: "Tag name is required" }),
  isDeleted: z.boolean(),
});

const courseDetailsSchema = z.object({
  level: z.string({ required_error: "Course level is required" }),
  description: z.string({ required_error: "Course description is required" }),
});

const courseValidationSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Course title is required" }),
    instructor: z.string({ required_error: "instructor is required" }),
    categoryId: z.string({ required_error: "categoryId is required" }),
    price: z.number({ required_error: "Course price is required" }),
    tags: z.array(tagSchema).refine((data) => data.length > 0, {
      message: "At least one tag is required",
    }),
    startDate: z.string({ required_error: "Start date is required" }),
    endDate: z.string({ required_error: "End Ddte is required" }),
    language: z.string({ required_error: "language is required" }),
    provider: z.string({ required_error: "Provider name is required" }),
    details: courseDetailsSchema,
  }),
});

const courseUpdateValidationSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Course title is required" }).optional(),
    instructor: z
      .string({ required_error: "Instructor is required" })
      .optional(),
    categoryId: z
      .string({ required_error: "Category ID is required" })
      .optional(),
    price: z.number({ required_error: "Course price is required" }).optional(),
    tags: z
      .array(tagSchema)
      .refine((data) => data.length > 0, {
        message: "At least one tag is required",
      })
      .optional(),
    startDate: z
      .string({ required_error: "Start date is required" })
      .optional(),
    endDate: z.string({ required_error: "End date is required" }).optional(),
    language: z.string({ required_error: "Language is required" }).optional(),
    provider: z
      .string({ required_error: "Provider name is required" })
      .optional(),
    details: courseDetailsSchema.optional(),
  }),
});

export const courseValidation = {
  courseValidationSchema,
  courseUpdateValidationSchema,
};
