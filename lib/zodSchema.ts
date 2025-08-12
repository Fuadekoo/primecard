import { user } from "@heroui/react";
import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(9, "username is too short"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
export type LoginType = z.infer<typeof loginSchema>;

export const cardSchema = z.object({
  guestId: z.string(),
  location: z.string().optional(),
});

export type CardType = z.infer<typeof cardSchema>;
