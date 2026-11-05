import { z } from "zod";
import { emailSchema, passwordSchema } from "../schemas/commonSchema.js";

export const registerSchema = z.object({
    name: z.string().min(3, "Name must have atleast 3 characters")
        .max(100, "Name can't exceed more than 100 characters"),
    email: emailSchema,
    age: z.coerce.number().min(16, "Age must be atleast 16 years"),
    password: passwordSchema
});

export const loginLogoutSchema = z.object({
    email: emailSchema,
    password: passwordSchema
});