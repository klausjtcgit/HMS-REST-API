import { NextFunction, Request, Response } from "express";
import { HTTPStatusCodes } from "../constants";
import { ResponseModel } from "../models/response.model";

export const errorMiddleware = (
  error: ResponseModel,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // istanbul ignore next
  res.status(error.status || HTTPStatusCodes.INTERNAL_SERVER_ERROR).json(error);
};
