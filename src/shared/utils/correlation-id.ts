import { randomUUID } from "crypto";

export function createCorrelationId() {
  return randomUUID();
}
