import fs from "fs";
import path from "path";

export function ensureLogDirectory(folder: string) {
  const logDir = path.join(process.cwd(), "logs", folder);

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, {
      recursive: true,
    });
  }

  return logDir;
}
