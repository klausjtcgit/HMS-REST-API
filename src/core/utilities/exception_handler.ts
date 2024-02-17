import { NextFunction } from "express";
import { HTTPCodes, ErrorTypes } from "../constants";
import { ResponseModel } from "../models/response.model";
import { DefaultExceptionModel } from "../models/exception.model";
import { stringifyDate } from "./conversion_helpers";
import { ILog } from "../interfaces/log.interface";
import { isEmpty } from "./utilities";

export function globalExceptionHandler(error: any, next: NextFunction) {
  try {
    if (error && !isEmpty(error.errors) && error.errors![0] instanceof DefaultExceptionModel) {
      next(error);
    } else {
      const errors: DefaultExceptionModel[] = [];

      if (error.code === 11000) {
        if (!isEmpty(error.keyValue)) {
          const key: string = Object.keys(error.keyValue)[0];
          const value: string = error.keyValue[key];

          error.status = HTTPCodes.CONFLICT;
          errors.push(
            new DefaultExceptionModel({
              type: ErrorTypes.CONFLICT,
              message: `The specified value for the field ${key}: ${value} already exists.`,
              details: { field: key, value: value },
            })
          );
        }
      } else if (error && error.errors && Object.keys(error.errors).length) {
        error.status = HTTPCodes.UNPROCESSABLE_ENTITY;
        Object.keys(error.errors).forEach((key) => {
          errors.push(
            new DefaultExceptionModel({
              type: ErrorTypes.BAD_REQUEST,
              message: error.errors[key][`message`],
              details: { field: key, value: error.errors[key][`value`] },
            })
          );
        });
      } else if (error.kind === `ObjectId`) {
        error.status = HTTPCodes.UNPROCESSABLE_ENTITY;
        errors.push(
          new DefaultExceptionModel({
            type: ErrorTypes.BAD_REQUEST,
            message: `Invalid _id was given`,
            details: {
              field: `_id`,
              value: error.value,
              suggestion: `Input must be a 24 character hex string, 12 byte Uint8Array, or an integer.`,
            },
          })
        );
      }

      if (!errors.length) {
        errors.push(
          new DefaultExceptionModel({
            type: ErrorTypes.INTERNAL_SERVER_ERROR,
            message: `Sorry, something went wrong on our end. Please try again or contact admin.`,
          })
        );
      }

      const log: ILog = {
        type: `error`,
        at: stringifyDate(new Date()),
        who: `system`,
        feature: `error.globalHandler`,
        action: `report`,
        data: errors,
      };

      next(
        new ResponseModel({
          success: false,
          message: ``,
          errors: errors,
        })
      );
    }
  } catch (error) {
    next(
      new ResponseModel({
        success: false,
        message: `An unexpected error occurred on the server. Please try again later.`,
        errors: [
          new DefaultExceptionModel({
            type: ErrorTypes.INTERNAL_SERVER_ERROR,
            message: `An unknown error occurred on globalExceptionHandler().`,
            details: `Please try again later or contact the system administrator for assistance. Include the request details to help diagnose the issue.`,
          }),
        ],
      })
    );
  }
}

export function notFoundExceptionHandler(name: string): never {
  throw new ResponseModel({
    success: false,
    message: `The requested resource was not found.`,
    errors: [
      new DefaultExceptionModel({
        type: ErrorTypes.NOT_FOUND,
        message: `The requested ${name} could not be found.`,
      }),
    ],
  });
}

export function noUpdateExceptionHandler(name: string): never {
  throw new ResponseModel({
    success: false,
    message: `No update data was provided. Please provide data to update the document.`,
    errors: [
      new DefaultExceptionModel({
        type: ErrorTypes.NOT_FOUND,
        message: `No update data was provided. Please provide data to update the ${name}.`,
      }),
    ],
  });
}

export function invalidObjectIdExceptionHandler(_idValue: any): never {
  throw new ResponseModel({
    success: false,
    message: `The provided MongoDB ObjectId is invalid. Please ensure that it is in the correct format.`,
    errors: [
      new DefaultExceptionModel({
        type: ErrorTypes.BAD_REQUEST,
        message: "Invalid ObjectId was given. ObjectId must be 24 character hex string.",
        details: { field: "request.params._id", value: _idValue },
      }),
    ],
  });
}

export function validationExceptionHandler(invalids: DefaultExceptionModel[]): never {
  throw new ResponseModel({
    success: false,
    message: `The provided data is either invalid or missing. Please check your input and try again.`,
    errors: invalids,
  });
}

export function unauthenticatedExceptionHandler(message?: string): never {
  throw new ResponseModel({
    success: false,
    message: `Authentication is required to access this resource.`,
    errors: [
      new DefaultExceptionModel({
        type: ErrorTypes.UNAUTHORIZED,
        message: `Invalid or expired token. Please log in to access this resource.`,
        details:
          message ||
          `Ensure that you have a valid authentication token and try again. If the issue persists, log in to obtain a new token.`,
      }),
    ],
  });
}

export function unauthorizedExceptionHandler(message?: string): never {
  throw new ResponseModel({
    success: false,
    message: `You are not authorized to access this resource.`,
    errors: [
      new DefaultExceptionModel({
        type: ErrorTypes.FORBIDDEN,
        message: `You do not have the required permissions to access this resource.`,
        details:
          message ||
          `Please contact your administrator or request the necessary permissions to perform this action.`,
      }),
    ],
  });
}

export function unknownExceptionHandler(message?: string): never {
  throw new ResponseModel({
    success: false,
    message: `An unexpected error occurred on the server. Please try again later.`,
    errors: [
      new DefaultExceptionModel({
        type: ErrorTypes.INTERNAL_SERVER_ERROR,
        message: message || `An unknown error occurred while processing your request.`,
        details: `Please try again later or contact the system administrator for assistance. Include the request details to help diagnose the issue.`,
      }),
    ],
  });
}
