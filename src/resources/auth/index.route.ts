import { Router } from "express";
import { IRoute } from "../../core/interfaces/routes.interface";
import { AuthRoute } from "./routes/auth.route";

export class AuthIndexRoute implements IRoute {
  public path = "/auth";
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(`${this.path}/`, new AuthRoute().router);
  }
}
