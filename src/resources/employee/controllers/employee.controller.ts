import { Request, Response, NextFunction } from "express";
import { IEmployee } from "../models/employee.model";
import { EmployeePermissions, HTTPCodes } from "../../../core/constants";
import { ControllerModel } from "../../../core/models/controller.model";
import { ResponseModel } from "../../../core/models/response.model";
import { EmployeeService } from "../services/employee.service";
import { globalExceptionHandler } from "../../../core/utilities/exception_handler";

export class EmployeeController extends ControllerModel<IEmployee, EmployeeService> {
  public employeeService: EmployeeService;

  constructor() {
    super("employee", "created", new EmployeeService());
    this.employeeService = this.service;
  }

  public registerEmployee = this.post;
  public registerManyEmployees = this.postMany;
  public findEmployees = this.get;
  public findEmployeeById = this.getById;
  public updateEmployees = this.patch;
  public updateEmployeeById = this.patchById;
  public deleteEmployees = this.delete;
  public deleteEmployeeById = this.deleteById;

  public getPermissionsByJobTitle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const defaultPermissions: Record<string, EmployeePermissions[]> =
        this.employeeService.getPermissionsByJobTitle();

      res.status(HTTPCodes.OK).json(
        new ResponseModel({
          success: true,
          message: `Permissions by job title retrieved successfully.`,
          data: { retrieved: defaultPermissions },
        })
      );
    } catch (error) {
      globalExceptionHandler(error, next);
    }
  };
}
