import { z } from "zod";

export const emailSchema = z.string().email("Please enter a valid email");
export const passwordSchema = z.string()
    .min(4, "Password must be atleast 4 characters")
    .regex(/[A-Z]/, "Password must contain atleast one Uppercase letter")
    .regex(/[a-z]/, "Password must contain atleast one Lowercase letter")
    .regex(/[0-9]/, "Password must contain atleast one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain atleast one special character")