import { TMap } from "../utilities/utilities";

export type TLogType = "error" | "warn" | "debug" | "info";
export type TLogAction = "create" | "update" | "delete" | "report";

export interface ILog {
  type: TLogType;
  at: string;
  who: string;
  feature: string;
  action: TLogAction;
  data?: TMap | TMap[];
  detail?: any;
}
