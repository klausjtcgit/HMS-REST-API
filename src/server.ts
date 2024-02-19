import { NextFunction, Request, Response, Router } from "express";
import { App } from "./app";
import { ResponseModel } from "./core/models/response.model";
import { ErrorTypes, HTTPCodes } from "./core/constants";
import {
  globalExceptionHandler,
  notFoundExceptionHandler,
  unauthenticatedExceptionHandler,
  unauthorizedExceptionHandler,
  unknownExceptionHandler,
  validationExceptionHandler,
} from "./core/utilities/exception_handler";
import { DefaultExceptionModel } from "./core/models/exception.model";
import { EmployeeIndexRoute } from "./resources/employee/index.route";
import { AuthIndexRoute } from "./resources/auth/index.route";

export const sampleRoute: Router = Router();

sampleRoute.all("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.query.errorType === "500") unknownExceptionHandler();
    else if (req.query.errorType === "404") notFoundExceptionHandler("test");
    else if (req.query.errorType === "422")
      validationExceptionHandler([
        new DefaultExceptionModel({
          type: ErrorTypes.UNPROCESSABLE_ENTITY,
          message: "this field should not have been here! 😉",
          details: {
            field: "req.query.errorType",
            value: req.query.errorType,
            suggestion: "this is obviously just for testing purpose only!",
          },
        }),
      ]);
    else if (req.query.errorType === "401") unauthenticatedExceptionHandler();
    else if (req.query.errorType === "403") unauthorizedExceptionHandler();
    else
      res.status(200).json(
        new ResponseModel({
          success: true,
          message: `Dev server is a go! Let the coding shenanigans commence! 🚀🎉`,
          data: {
            message:
              "🎉 Woohoo! It works! 🚀 Time to get things done! Let's embark on our journey and make magic happen! 💻✨ #ProductivityModeActivated 🎊👏 Let's do this bro! 🙌",
            motto:
              "Well, look at you, breaking records! 🎉 You've officially achieved the 'Quarter Century and Still Cozy at Home' status. Who needs bills, right? Living the dream! 😂🏠 #ParentalSuiteLife",
          },
        })
      );
  } catch (error: any) {
    globalExceptionHandler(error, next);
  }
});

export const app: App = new App([
  { router: sampleRoute },
  new EmployeeIndexRoute(),
  new AuthIndexRoute(),
]);

const server = app.listen();

// istanbul ignore next
export const closeServer = async () => {
  server.close(async () => {
    await app.closeDatabaseConnection();
  });
};
