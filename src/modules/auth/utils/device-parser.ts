import { UAParser } from "ua-parser-js";

export function parseUserAgent(userAgent?: string) {
  const parser = new UAParser(userAgent);

  const result = parser.getResult();

  return {
    browser: result.browser.name ?? null,

    operatingSystem: result.os.name ?? null,

    deviceName: result.device.model ?? null,

    deviceType: result.device.type ?? "desktop",
  };
}
