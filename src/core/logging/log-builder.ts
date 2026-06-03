export function buildLog(event: string, data?: Record<string, unknown>) {
  return {
    event,
    timestamp: new Date().toISOString(),
    ...data,
  };
}
