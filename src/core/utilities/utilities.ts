import { TLogAction } from "../interfaces/log.interface";
import { TFilterValue } from "../models/query.model";

export type TMap = Record<string, any>;
export type LoggingFunction = (action: TLogAction, data: TMap) => void;
export type FilterExtractorFunction = (input: Record<string, TFilterValue>) => TMap;

export const isEmpty = (value: any): boolean => {
  return value == null || value === "" || (typeof value === "object" && !Object.keys(value).length);
};

export const isObjectId = (_id: string): boolean => /^[0-9a-fA-F]{24}$/.test(_id);
