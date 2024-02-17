import winston from "winston";
import { NODE_ENV } from "../configuration";

const env: string = NODE_ENV!;

const config = {
  levels: { error: 0, warn: 1, debug: 2, data: 3, info: 4, verbose: 5, silly: 6 },
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
export const wLogger = (name: string): winston.Logger =>
  winston.createLogger({
    levels: config.levels,
    transports: [
      ...(env === "development"
        ? [
            new winston.transports.Console({
              format: winston.format.combine(
                winston.format.printf((info) => `${info.message}`),
                winston.format.colorize({ all: true })
              ),
            }),
          ]
        : []),

      new winston.transports.File({
        filename: `./logs/${name}.log`,
        format: winston.format.printf((info) => `${info.message}`),
      }),
      new winston.transports.File({
        filename: `./logs/all.log`,
        format: winston.format.printf((info) => `${info.message}`),
      }),
    ],
  });
