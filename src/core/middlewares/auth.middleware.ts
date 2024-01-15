import { NextFunction, Request, Response } from "express";
import { isEmpty } from "../utilities/utilities";
import {
  unauthenticatedExceptionHandler,
  unauthorizedExceptionHandler,
} from "../utilities/exception_handler";
import jwt, { Secret } from "jsonwebtoken";
import { TOKEN_KEY } from "../configuration";

export const authMiddleware = (requiredPermissions?: string[]) => {
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const accessToken =
        req.body.accessToken ||
        req.query.accessToken ||
        req.headers["authorization"]?.split(" ")[1] ||
        req.headers["x-access-token"];

      if (isEmpty(accessToken))
        unauthenticatedExceptionHandler(
          "Access token is missing in the request header. Include a valid access token in the 'Authorization' header and try again."
        );
      else {
        const decoded = jwt.verify(accessToken, TOKEN_KEY as Secret) as any;

        const notPermitted: string[] = [];

        if (requiredPermissions) {
          requiredPermissions.forEach((requiredPermission: string) => {
            if (!decoded.permissions.includes(requiredPermission))
              notPermitted.push(requiredPermission);
          });

          if (notPermitted.length === 0) next();
          else {
            unauthorizedExceptionHandler();
          }
        }

        req.body.requesterId = decoded._id;
        next();
      }
    } catch (error) {
      unauthenticatedExceptionHandler();
    }
  };
};
