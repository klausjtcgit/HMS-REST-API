import { NextFunction, Request, Response } from "express";
import { ErrorTypes } from "../constants";
import { DefaultExceptionModel } from "../models/exception.model";
import { ResponseModel } from "../models/response.model";

export const notFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const error: ResponseModel = new ResponseModel({
    success: false,
    message: `Resource not found`,
    errors: [
      new DefaultExceptionModel({
        type: ErrorTypes.NOT_FOUND,
        message: `Resource not found on the server.`,
        details: `The requested URL [${req.method}]:${req.originalUrl} does not exist on the server. Please check the URL and try again.`,
      }),
    ],
  });

  next(error);
};
