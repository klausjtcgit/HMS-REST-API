import { ErrorTypes } from "../constants";

interface IDefaultException {
  type: ErrorTypes;
  message: string;
  details?: any;
}

export class DefaultExceptionModel extends Error implements IDefaultException {
  public type: ErrorTypes;
  public details?: any;

  constructor({ type, message, details }: IDefaultException) {
    super(message);
    this.type = type;
    this.details = details;
  }

  toJSON() {
    return {
      type: this.type,
      message: this.message,
      details: this.details,
    };
  }
}
