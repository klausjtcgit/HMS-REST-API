import winston from "winston";
import { stringifyDate } from "./conversion_helpers";

const config = {
  levels: {
    error: 0,
    warn: 1,
    debug: 2,
    data: 3,
    info: 4,
    verbose: 5,
    silly: 6,
  },
  colors: {
    error: "red",
    debug: "blue",
    warn: "yellow",
    data: "magenta",
    info: "green",
    verbose: "cyan",
    silly: "grey",
  },
};

winston.addColors(config.colors);
export const wLogger = (name: string, isAudit: boolean = false): winston.Logger =>
  winston.createLogger({
    levels: config.levels,
    transports: [
      new winston.transports.Console({
        level: "silly",
        format: winston.format.combine(
          winston.format.printf(
            (info) => `${stringifyDate()} ${info.level.toLocaleUpperCase()}: ${info.message}`
          ),
          winston.format.colorize({ all: true })
        ),
      }),

      new winston.transports.File({
        filename: `./logs/${name}.error.log`,
        level: "error",
        format: winston.format.printf(
          (info) => `${stringifyDate()} ${info.level.toLocaleUpperCase()}: ${info.message}`
        ),
      }),

      new winston.transports.File({
        filename: `./logs/${name}.warn.log`,
        level: "warn",
        format: winston.format.printf(
          (info) => `${stringifyDate()} ${info.level.toLocaleUpperCase()}: ${info.message}`
        ),
      }),

      new winston.transports.File({
        filename: `./logs/${name}.debug.log`,
        level: "debug",
        format: winston.format.printf(
          (info) => `${stringifyDate()} ${info.level.toLocaleUpperCase()}: ${info.message}`
        ),
      }),

      new winston.transports.File({
        filename: `./logs/${name}.${isAudit ? "audit" : "data"}.log`,
        level: "data",
        format: winston.format.printf(
          (info) => `${stringifyDate()} ${info.level.toLocaleUpperCase()}: ${info.message}`
        ),
      }),
    ],
  });
