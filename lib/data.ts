import { SignUpTypes, LoginTypes } from "@/lib/types";

export const MOCK_USERS: (SignUpTypes & { id: string })[] = [
  {
    id: "1",
    name: "John Doe",
    email: "test@example.com",
    password: "password123",
    confirmPassword: "password123",
  },
  {
    id: "2",
    name: "Admin",
    email: "admin@nabula.ai",
    password: "adminpassword",
    confirmPassword: "adminpassword",
  }
];
