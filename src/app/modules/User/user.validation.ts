import { z } from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const userValidationSchema = z.object({
  body: z.object({
    username: z.string().min(1).max(255),
    email: z.string().email(),
    password: z.string().refine((data: string) => passwordRegex.test(data), {
      message:
        "Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, and one digit.",
    }),
    role: z.enum(["user", "admin"]).default("user"),
  }),
});

export const UserValidation = {
  userValidationSchema,
};
