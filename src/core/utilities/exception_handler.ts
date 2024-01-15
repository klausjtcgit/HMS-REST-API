import { NextFunction } from "express";
import { HTTPStatusCodes, ErrorTypes } from "../constants";
import { ResponseModel } from "../models/response.model";
import { DefaultExceptionModel, ValidationExceptionModel } from "../models/exception.model";

export function globalExceptionHandler(error: any, next: NextFunction) {
  const _error: ResponseModel = new ResponseModel({
    success: false,
    status: error.status,
    result: {
      errors: error.errors,
    },
  });

  next(_error);
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
