import { LoggingFunction, TMap } from "../../../core/utilities/utilities";
import { stringifyDate } from "../../../core/utilities/conversion_helpers";
import { wLogger } from "../../../core/utilities/logger";
import { ILog, TLogAction } from "../../../core/interfaces/log.interface";

const logger = wLogger("employee");
const feature = "employee.employee";
const type = "info";

export const auditLogging: LoggingFunction = (action: TLogAction, data: TMap): void => {
  const { createdAt, createdBy, updatedAt, updatedBy } = data;
  const who = updatedBy ?? createdBy;
  const at = stringifyDate(updatedAt ?? createdAt);

  const log: ILog = { type, at, who, feature, action, data };

  logger.log("info", JSON.stringify(log));
};

export const sanitizeEmployee = (employee: TMap) => {
  const { code, password, deleted, ...sanitizedEmployee } = employee;

  return sanitizedEmployee;
};
