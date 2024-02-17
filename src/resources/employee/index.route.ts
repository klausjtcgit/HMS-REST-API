import { Router } from "express";
import { IRoute } from "../../core/interfaces/routes.interface";
import { EmployeeRoute } from "./routes/employee.route";

export class EmployeeIndexRoute implements IRoute {
  public path = "/employee";
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(`${this.path}/`, new EmployeeRoute().router);
  }
}
