import { HTTPStatusCodes } from "../constants";
import { DefaultExceptionModel, ValidationExceptionModel } from "./exception.model";

interface IResponse {
  success: boolean;
  status: HTTPStatusCodes;
  result?: {
    data?: any;
    errors?: (DefaultExceptionModel | ValidationExceptionModel)[];
  };
  meta?: any;
}

export class ResponseModel implements IResponse {
  public success;
  public result;
  public status;
  public meta;

  constructor({ success, status, result, meta }: IResponse) {
    this.success = success;
    this.status = status;
    this.result = result;
    this.meta = meta;
  }
}
