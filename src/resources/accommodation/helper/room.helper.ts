import { FilterExtractorFunction, LoggingFunction, TMap } from "../../../core/utilities/utilities";
import { stringifyDate, toBoolean } from "../../../core/utilities/conversion_helpers";
import { TFilterValue } from "../../../core/models/query.model";
import { wLogger } from "../../../core/utilities/logger";
import { ILog, TLogAction } from "../../../core/interfaces/log.interface";

const logger = wLogger("accommodation");
const feature = "accommodation.room";
const type = "info";

export const auditLogging: LoggingFunction = (action: TLogAction, data: TMap): void => {
  const { createdAt, createdBy, updatedAt, updatedBy } = data;
  const who = updatedBy ?? createdBy;
  const at = stringifyDate(updatedAt ?? createdAt);

  const log: ILog = { type, at, who, feature, action, data };

  logger.log("info", JSON.stringify(log));
};

export const getRoomFilter: FilterExtractorFunction = (input: {
  _ids?: TFilterValue;
  number?: TFilterValue;
  type?: TFilterValue;
  floor?: TFilterValue;
  isClean?: TFilterValue;
  occupancy?: TFilterValue;
  isOutOfOrder?: TFilterValue;
}): TMap => {
  let filter: TMap = {};
  if (input._ids !== undefined && input._ids.equal !== undefined) {
    filter._id = { $in: input._ids.equal.replace(" ", "").split(",") };
  } else {
    if (input.number !== undefined && input.number.equal !== undefined)
      filter.number = input.number.equal;
    if (input.type !== undefined && input.type.equal !== undefined) filter.type = input.type.equal;
    if (input.floor !== undefined && input.floor.equal !== undefined)
      filter.floor = input.floor.equal;
    if (input.isClean !== undefined && input.isClean.equal !== undefined)
      filter.isClean = toBoolean(input.isClean.equal);
    if (input.occupancy !== undefined && input.occupancy.equal !== undefined)
      filter.occupancy = input.occupancy.equal;
    if (input.isOutOfOrder !== undefined && input.isOutOfOrder.equal !== undefined)
      filter.isOutOfOrder = toBoolean(input.isOutOfOrder.equal);
  }

  return filter;
};
