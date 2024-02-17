import { DefaultExceptionModel } from "./exception.model";

interface IResponse {
  success: boolean;
  message: string;
  data?: any;
  errors?: DefaultExceptionModel[];
}

export class ResponseModel implements IResponse {
  public success: boolean;
  public message: string;
  public data: any | undefined;
  public errors: DefaultExceptionModel[] | undefined;

  constructor({ success, message, data, errors }: IResponse) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = errors;
  }
}
