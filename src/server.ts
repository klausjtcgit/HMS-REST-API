import { NextFunction, Request, Response, Router } from "express";
import { App } from "./app";
import { ResponseModel } from "./core/models/response.model";
import { ErrorTypes, HTTPStatusCodes } from "./core/constants";
import {
  globalExceptionHandler,
  notFoundExceptionHandler,
  unauthenticatedExceptionHandler,
  unauthorizedExceptionHandler,
  unknownExceptionHandler,
  validationExceptionHandler,
} from "./core/utilities/exception_handler";
import { ValidationExceptionModel } from "./core/models/exception.model";

export const sampleRoute: Router = Router();

sampleRoute.all("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.query.errorType === "500") unknownExceptionHandler();
    else if (req.query.errorType === "404") notFoundExceptionHandler("test");
    else if (req.query.errorType === "422")
      validationExceptionHandler([
        new ValidationExceptionModel({
          type: ErrorTypes.INVALID_DATA,
          message: "this field should not have been here! 😉",
          field: "req.query.errorType",
          value: req.query.errorType,
          details: "this is obviously just for testing purpose only!",
        }),
      ]);
    else if (req.query.errorType === "401") unauthenticatedExceptionHandler();
    else if (req.query.errorType === "403") unauthorizedExceptionHandler();
    else
      res.status(200).json(
        new ResponseModel({
          success: true,
          status: HTTPStatusCodes.OK,
          result: {
            data: {
              message:
                "🎉 Woohoo! It works! 🚀 Time to get things done! Let's embark on our journey and make magic happen! 💻✨ #ProductivityModeActivated 🎊👏 Let's do this bro! 🙌",
              motto:
                "Well, look at you, breaking records! 🎉 You've officially achieved the 'Quarter Century and Still Cozy at Home' status. Who needs bills, right? Living the dream! 😂🏠 #ParentalSuiteLife",
            },
          },
          meta: {
            query: req.query,
            body: req.body,
          },
        })
      );
  } catch (error: any) {
    globalExceptionHandler(error, next);
  }
});

export const app: App = new App([{ router: sampleRoute }]);

const server = app.listen();

// istanbul ignore next
export const closeServer = async () => {
  server.close(async () => {
    await app.closeDatabaseConnection();
  });
};
