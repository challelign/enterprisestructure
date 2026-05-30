import { randomUUID } from "crypto";

export const generateTraceId = () => {
  return randomUUID();
};