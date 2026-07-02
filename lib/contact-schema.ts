import { z } from "zod";

// shared by the form (client) and the API route (server)
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name is too short")
    .max(100, "Name is too long"),
  email: z.email("Enter a valid email").trim().max(200),
  message: z
    .string()
    .trim()
    .min(10, "Message should be at least 10 characters")
    .max(5000, "Message is too long"),
  // honeypot – humans never see or fill this field
  website: z.literal("").optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
