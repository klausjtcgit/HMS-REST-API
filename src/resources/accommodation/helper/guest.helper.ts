import { FilterExtractorFunction, LoggingFunction, TMap } from "../../../core/utilities/utilities";
import { stringifyDate, toBoolean, toNumber } from "../../../core/utilities/conversion_helpers";
import { TFilterValue } from "../../../core/models/query.model";
import { wLogger } from "../../../core/utilities/logger";
import { ILog, TLogAction } from "../../../core/interfaces/log.interface";

const logger = wLogger("accommodation");
const feature = "accommodation.guest";
const type = "info";

export const auditLogging: LoggingFunction = (action: TLogAction, data: TMap): void => {
  const { createdAt, createdBy, updatedAt, updatedBy } = data;
  const who = updatedBy ?? createdBy;
  const at = stringifyDate(updatedAt ?? createdAt);

  const log: ILog = { type, at, who, feature, action, data };

  logger.log("info", JSON.stringify(log));
};

export const getGuestFilter: FilterExtractorFunction = (input: {
  _ids?: TFilterValue;
  name?: TFilterValue;
  firstName?: TFilterValue;
  lastName?: TFilterValue;
  middleName?: TFilterValue;
  IDNumber?: TFilterValue;
  phone?: TFilterValue;
  email?: TFilterValue;
  nationality?: TFilterValue;
  isGroup?: TFilterValue;
  balance?: TFilterValue;
}): TMap => {
  let filter: TMap = {};

  if (input._ids !== undefined && input._ids.equal !== undefined) {
    filter._id = { $in: input._ids.equal.replace(" ", "").split(",") };
  } else {
    if (input.name !== undefined && input.name.equal)
      filter.$or = [
        { firstName: { $regex: `^.*${input.name.equal}.*$`, $options: "i" } },
        { lastName: { $regex: `^.*${input.name.equal}.*$`, $options: "i" } },
        { middleName: { $regex: `^.*${input.name.equal}.*$`, $options: "i" } },
      ];

    if (input.firstName !== undefined && input.firstName.equal !== undefined)
      filter.firstName = { $regex: `^.*${input.firstName.equal}.*$`, $options: "i" };

    if (input.lastName !== undefined && input.lastName.equal !== undefined)
      filter.lastName = { $regex: `^.*${input.lastName.equal}.*$`, $options: "i" };

    if (input.middleName !== undefined && input.middleName.equal !== undefined)
      filter.middleName = { $regex: `^.*${input.middleName.equal}.*$`, $options: "i" };

    if (input.IDNumber !== undefined && input.IDNumber.equal !== undefined)
      filter.IDNumber = { $regex: `^.*${input.IDNumber.equal}.*$`, $options: "i" };

    if (input.phone !== undefined && input.phone.equal !== undefined)
      filter.phone = { $regex: `^.*${input.phone.equal}.*$`, $options: "i" };

    if (input.email !== undefined && input.email.equal !== undefined)
      filter.email = { $regex: `^.*${input.email.equal}.*$`, $options: "i" };

    if (input.nationality !== undefined && input.nationality.equal !== undefined)
      filter.nationality = input.nationality.equal;

    if (input.isGroup !== undefined && input.isGroup.equal !== undefined)
      filter.isGroup = toBoolean(input.isGroup.equal);

    if (input.balance !== undefined)
      if (input.balance.equal !== undefined) filter.balance = toNumber(input.balance.equal);
      else if (input.balance.range !== undefined) {
        filter.balance = {};

        if (input.balance.range.gte !== undefined)
          filter.balance.$gte = toNumber(input.balance.range.gte);
        else if (input.balance.range.gt !== undefined)
          filter.balance.$gt = toNumber(input.balance.range.gt);

        if (input.balance.range.lte !== undefined)
          filter.balance.$lte = toNumber(input.balance.range.lte);
        else if (input.balance.range.lt !== undefined)
          filter.balance.$lt = toNumber(input.balance.range.lt);

        if (input.balance.range.not !== undefined)
          filter.balance.$ne = toNumber(input.balance.range.not);
      }
  }

  return filter;
};
