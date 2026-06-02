import { z } from "zod";

export const LogoutAllSchema = z.object({
  userId: z.string().uuid(),
});

export type LogoutAllDto = z.infer<typeof LogoutAllSchema>;
