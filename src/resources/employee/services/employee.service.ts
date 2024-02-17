import { EmployeePermissions } from "../../../core/constants";
import { ServiceModel } from "../../../core/models/services.model";
import { EmployeeModel, IEmployee } from "../models/employee.model";
import { isEmpty } from "../../../core/utilities/utilities";
import { auditLogging, defaultPermission, getEmployeeFilter } from "../helper/employee.helper";
import { IInsertResponse } from "../../../core/interfaces/write_responses.interface";

export class EmployeeService extends ServiceModel<IEmployee> {
  constructor() {
    super("employee", EmployeeModel, auditLogging, getEmployeeFilter);
  }

  async create(newDocument: IEmployee): Promise<IEmployee> {
    if (isEmpty(newDocument.permissions))
      newDocument.permissions = defaultPermission[newDocument.jobTitle];

    return super.create(newDocument);
  }

  async createMany(newDocuments: IEmployee[]): Promise<IInsertResponse<IEmployee>> {
    for (let i = 0; i < newDocuments.length; i++) {
      if (isEmpty(newDocuments[i].permissions))
        newDocuments[i].permissions = defaultPermission[newDocuments[i].jobTitle];
    }

    return super.createMany(newDocuments);
  }

  getPermissionsByJobTitle(): Record<string, EmployeePermissions[]> {
    return defaultPermission;
  }
}
