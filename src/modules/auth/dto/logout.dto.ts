import { z } from "zod";

export const LogoutSchema = z.object({
  sessionId: z.string().uuid(),
});

export type LogoutDto = z.infer<typeof LogoutSchema>;
