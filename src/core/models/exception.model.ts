import { ErrorTypes } from "../constants";

interface IDefaultException {
  type: ErrorTypes;
  message: string;
  details?: any;
}

interface IValidationException extends IDefaultException {
  field: string;
  value: any;
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

export class ValidationExceptionModel
  extends DefaultExceptionModel
  implements IValidationException
{
  public type: ErrorTypes;
  public message: string;
  public field: string;
  public value: any;
  public details?: any;

  constructor({ type, message, field, value, details }: IValidationException) {
    super({ type, message, details });
    this.type = type;
    this.message = message;
    this.field = field;
    this.value = value;
    this.details = details;
  }

  toJSON() {
    return {
      type: this.type,
      message: this.message,
      field: this.field,
      value: this.value,
      details: this.details,
    };
  }
}
