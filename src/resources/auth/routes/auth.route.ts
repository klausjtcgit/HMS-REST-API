import { Router } from "express";
import { IRoute } from "../../../core/interfaces/routes.interface";
import { AuthController } from "../controllers/auth.controller";

export class AuthRoute implements IRoute {
  public path = "";
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      [`${this.path}/login`, `${this.path}/regularLogin/`],
      this.authController.regularLogin
    );

    this.router.post(
      [`${this.path}/advanceLogin`, `${this.path}/adminLogin/`, `${this.path}/managerLogin/`],
      this.authController.adminLogin
    );
  }
}
