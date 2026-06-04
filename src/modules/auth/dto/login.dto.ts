import { z } from "zod";

export const LoginSchema = z.object({
  // tenantCode: z.string().min(1),
  email: z.email(),
  password: z.string().min(6),
});

export type LoginDto = z.infer<typeof LoginSchema>;
