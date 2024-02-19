import { Router } from "express";
import { IRoute } from "../../../core/interfaces/routes.interface";
import { EmployeeController } from "../controllers/employee.controller";
import { authMiddleware } from "../../../core/middlewares/auth.middleware";
import { EmployeePermissions } from "../../../core/constants";
// import { authMiddleware } from "../../../core/middlewares/auth.middleware";
// import { EmployeePermissions as permissions } from "../../../core/constants";

export class EmployeeRoute implements IRoute {
  public path = "";
  public router = Router();
  public employeesController = new EmployeeController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/`,
      authMiddleware([EmployeePermissions.registerEmployee]),
      this.employeesController.registerEmployee
    );
    this.router.post(
      [`${this.path}/batch/`, `${this.path}/many/`],
      authMiddleware([EmployeePermissions.registerEmployee]),
      this.employeesController.registerManyEmployees
    );

    this.router.get(
      [`${this.path}/`, `${this.path}/_ids/`],
      authMiddleware([]),
      this.employeesController.findEmployees
    );
    this.router.get(
      `${this.path}/defaultPermissionByJobTitle/`,
      this.employeesController.getPermissionsByJobTitle
    );
    this.router.get(
      [
        `${this.path}/:_id/`,
        `${this.path}/_id/:_id/`,
        `${this.path}/id/:_id/`,
        `${this.path}/byId/:_id/`,
      ],
      authMiddleware([]),
      this.employeesController.findEmployeeById
    );

    this.router.patch(
      [`${this.path}/`, `${this.path}/sensitiveInfo/`],
      authMiddleware([
        EmployeePermissions.updateEmployeeInfo,
        EmployeePermissions.updateEmployeePermissions,
      ]),
      this.employeesController.updateEmployees
    );
    this.router.patch(
      [
        `${this.path}/:_id/`,
        `${this.path}/sensitiveInfo/:_id/`,
        `${this.path}/_id/:_id/`,
        `${this.path}/sensitiveInfo/_id/:_id/`,
      ],
      authMiddleware([
        EmployeePermissions.updateEmployeeInfo,
        EmployeePermissions.updateEmployeePermissions,
      ]),
      this.employeesController.updateEmployeeById
    );

    this.router.delete(
      `${this.path}/`,
      authMiddleware([
        EmployeePermissions.updateEmployeeInfo,
        EmployeePermissions.updateEmployeePermissions,
      ]),
      this.employeesController.deleteEmployees
    );
    this.router.delete(
      [`${this.path}/:_id/`, `${this.path}/_id/:_id/`],
      authMiddleware([
        EmployeePermissions.updateEmployeeInfo,
        EmployeePermissions.updateEmployeePermissions,
      ]),
      this.employeesController.deleteEmployeeById
    );
  }
}
