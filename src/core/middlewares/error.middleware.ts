import { NextFunction, Request, Response } from "express";
import { ErrorTypes, HTTPCodesMapping } from "../constants";
import { ResponseModel } from "../models/response.model";

export const errorMiddleware = (
  error: ResponseModel,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // istanbul ignore next
  res
    .status(HTTPCodesMapping[error.errors?.[0]?.type ?? ErrorTypes.INTERNAL_SERVER_ERROR])
    .json(error);
};
