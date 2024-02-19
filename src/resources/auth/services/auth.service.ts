import { ErrorTypes } from "../../../core/constants";
import { EmployeeModel, IEmployee } from "../../employee/models/employee.model";
import { DefaultExceptionModel } from "../../../core/models/exception.model";
import { ResponseModel } from "../../../core/models/response.model";

export class AuthService {
  async regularLogin(code: string): Promise<IEmployee> {
    const employee = await EmployeeModel.findOne({ code: code });

    if (!employee)
      throw new ResponseModel({
        success: false,
        message: `Employee not found.`,
        errors: [
          new DefaultExceptionModel({
            type: ErrorTypes.NOT_FOUND,
            message: `Employee not found with provided code/phone.`,
          }),
        ],
      });
    else return employee;
  }

  async adminLogin(codeOrPhone: string, password: string): Promise<IEmployee> {
    const employee = await EmployeeModel.findOne({
      $or: [{ code: codeOrPhone }, { phone: codeOrPhone }],
    });

    if (!employee)
      throw new ResponseModel({
        success: false,
        message: `Employee not found.`,
        errors: [
          new DefaultExceptionModel({
            type: ErrorTypes.NOT_FOUND,
            message: `Employee not found with provided code/phone.`,
          }),
        ],
      });
    else {
      if (await employee.matchPassword(password)) return employee;
      else
        throw new ResponseModel({
          success: false,
          message: `Incorrect password.`,
          errors: [
            new DefaultExceptionModel({
              type: ErrorTypes.UNAUTHORIZED,
              message: `Incorrect password.`,
              details: `The password provided is incorrect. If you forgot your password contact admin to rest the password.`,
            }),
          ],
        });
    }
  }
}
