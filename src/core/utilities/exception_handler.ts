import { NextFunction } from "express";
import { HTTPStatusCodes, ErrorTypes } from "../constants";
import { ResponseModel } from "../models/response.model";
import { DefaultExceptionModel, ValidationExceptionModel } from "../models/exception.model";

export function globalExceptionHandler(error: any, next: NextFunction) {
  const errors: (DefaultExceptionModel | ValidationExceptionModel)[] = [];

  if (error.result && error.result.errors) {
    errors.push(...error.result.errors);
  } else if (error.code === 11000) {
    const key: string = Object.keys(error.keyValue)[0];
    const value: string = error.keyValue[key];

    errors.push(
      new ValidationExceptionModel({
        type: ErrorTypes.DUPLICATED,
        message: `The specified value for the field ${key}: ${value} already exists.`,
        field: key,
        value: value,
      })
    );
  } else if (error && error.errors && Object.keys(error.errors).length) {
    Object.keys(error.errors).forEach((key) => {
      errors.push(
        new ValidationExceptionModel({
          type:
            error.errors[key]["kind"] === "required"
              ? ErrorTypes.MISSING_DATA
              : ErrorTypes.INVALID_DATA,
          message: error.errors[key]["message"],
          field: key,
          value: error.errors[key]["value"],
        })
      );
    });
  }

  if (!errors.length)
    errors.push(
      new DefaultExceptionModel({
        type: ErrorTypes.UNKNOWN,
        message: `Sorry, something went wrong on our end. Please try again or contact admin.`,
      })
    );

  next(
    new ResponseModel({
      success: false,
      status: error.status ?? HTTPStatusCodes.INTERNAL_SERVER_ERROR,
      result: {
        errors: errors,
      },
    })
  );
}

export function notFoundExceptionHandler(resource: string): never {
  throw new ResponseModel({
    success: false,
    status: HTTPStatusCodes.NOT_FOUND,
    result: {
      errors: [
        new DefaultExceptionModel({
          type: ErrorTypes.NOT_FOUND,
          message: `The requested ${resource} could not be found.`,
          details: `Please check the provided parameters/filers or ensure that the resource exists.`,
        }),
      ],
    },
  });
}

export function validationExceptionHandler(invalids: ValidationExceptionModel[]): never {
  throw new ResponseModel({
    success: false,
    status: HTTPStatusCodes.UNPROCESSABLE_ENTITY,
    result: {
      errors: invalids,
    },
  });
}

export function unauthenticatedExceptionHandler(message?: string): never {
  throw new ResponseModel({
    success: false,
    status: HTTPStatusCodes.UNAUTHORIZED,
    result: {
      errors: [
        new DefaultExceptionModel({
          type: ErrorTypes.UNAUTHENTICATED,
          message: `Invalid or expired token. Please log in to access this resource.`,
          details:
            message ||
            `Ensure that you have a valid authentication token and try again. If the issue persists, log in to obtain a new token.`,
        }),
      ],
    },
  });
}

export function unauthorizedExceptionHandler(message?: string): never {
  throw new ResponseModel({
    success: false,
    status: HTTPStatusCodes.FORBIDDEN,
    result: {
      errors: [
        new DefaultExceptionModel({
          type: ErrorTypes.UNAUTHORIZED,
          message: `You do not have the required permissions to access this resource.`,
          details:
            message ||
            `Please contact your administrator or request the necessary permissions to perform this action.`,
        }),
      ],
    },
  });
}

export function unknownExceptionHandler(message?: string): never {
  throw new ResponseModel({
    success: false,
    status: HTTPStatusCodes.INTERNAL_SERVER_ERROR,
    result: {
      errors: [
        new DefaultExceptionModel({
          type: ErrorTypes.UNKNOWN,
          message: message || `An unknown error occurred while processing your request.`,
          details: `Please try again later or contact the system administrator for assistance. Include the request details to help diagnose the issue.`,
        }),
      ],
    },
  });
}
