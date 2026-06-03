import { z } from "zod";

export const AuditSearchSchema = z.object({
  page: z.coerce.number().default(1),

  pageSize: z.coerce.number().default(20),

  userId: z.string().optional(),

  resourceType: z.string().optional(),

  actionType: z.string().optional(),
});

export type AuditSearchDto = z.infer<typeof AuditSearchSchema>;
