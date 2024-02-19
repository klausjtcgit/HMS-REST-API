import { Request, Response, NextFunction } from "express";
import { ErrorTypes, HTTPCodes } from "../../../core/constants";
import { ResponseModel } from "../../../core/models/response.model";
import { AuthService } from "../services/auth.service";
import {
  globalExceptionHandler,
  validationExceptionHandler,
} from "../../../core/utilities/exception_handler";
import { IEmployee } from "../../employee/models/employee.model";
import { isEmpty } from "../../../core/utilities/utilities";
import { DefaultExceptionModel } from "../../../core/models/exception.model";
import { sanitizeEmployee } from "../helper/auth.helper";
import jwt, { Secret } from "jsonwebtoken";
import { TOKEN_KEY } from "../../../core/configuration";

export class AuthController {
  public authService: AuthService = new AuthService();

  public regularLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = req.body;

      if (isEmpty(code))
        validationExceptionHandler([
          new DefaultExceptionModel({
            message: "code is missing. Must provide either code to find employee",
            type: ErrorTypes.NOT_FOUND,
          }),
        ]);
      else {
        const employee: IEmployee = await this.authService.regularLogin(code);

        const sanitizedEmployee = sanitizeEmployee(employee.toObject());
        const accessToken: string = jwt.sign(employee.toObject(), TOKEN_KEY as Secret, {
          expiresIn: "60000hr",
        });

        res.status(HTTPCodes.OK).json(
          new ResponseModel({
            success: true,
            message: `Successfully logged in.`,
            data: { loggedInEmployee: sanitizedEmployee, accessToken },
          })
        );
      }
    } catch (error) {
      globalExceptionHandler(error, next);
    }
  };

  public adminLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, phone, password } = req.body;

      if (isEmpty(code) && isEmpty(phone))
        validationExceptionHandler([
          new DefaultExceptionModel({
            message: "code/phone is missing. Must provide either code or phone to find employee",
            type: ErrorTypes.NOT_FOUND,
          }),
        ]);
      else if (isEmpty(password))
        validationExceptionHandler([
          new DefaultExceptionModel({
            message: "password is missing. Must provide either password.",
            type: ErrorTypes.NOT_FOUND,
          }),
        ]);
      else {
        const employee: IEmployee = await this.authService.adminLogin(code || phone, password);

        const sanitizedEmployee = sanitizeEmployee(employee.toObject());
        const accessToken: string = jwt.sign(employee.toObject(), TOKEN_KEY as Secret, {
          expiresIn: "6hr",
        });

        res.status(HTTPCodes.OK).json(
          new ResponseModel({
            success: true,
            message: `Permissions by job title retrieved successfully.`,
            data: { loggedInEmployee: sanitizedEmployee, accessToken },
          })
        );
      }
    } catch (error) {
      globalExceptionHandler(error, next);
    }
  };
}
