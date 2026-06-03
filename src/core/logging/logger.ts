import winston from "winston";
import path from "path";

import { ensureLogDirectory } from "./log-path";

import { getLogFileName } from "./log-date";

const applicationDir = ensureLogDirectory("application");

const errorDir = ensureLogDirectory("errors");

const fileName = getLogFileName();

export const logger = winston.createLogger({
  level: "info",

  format: winston.format.combine(
    winston.format.timestamp(),

    winston.format.errors({
      stack: true,
    }),

    winston.format.json(),
  ),

  transports: [
    new winston.transports.Console(),

    new winston.transports.File({
      filename: path.join(applicationDir, `${fileName}.log`),
    }),

    new winston.transports.File({
      filename: path.join(errorDir, `${fileName}.log`),

      level: "error",
    }),
  ],
});
