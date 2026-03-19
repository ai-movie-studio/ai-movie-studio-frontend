import { signUpSchema, forgotPasswordSchema } from "@/components/schema/auth_schema"
import { z } from "zod"

export type LoginTypes = {
  email: string;
  password: string;
};

export type SignUpTypes = z.infer<typeof signUpSchema>;

export type ForgotPasswordTypes = z.infer<typeof forgotPasswordSchema>;