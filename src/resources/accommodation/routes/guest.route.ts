import { Router } from "express";
import { IRoute } from "../../../core/interfaces/routes.interface";
import { GuestController } from "../controllers/guest.controller";
import { authMiddleware } from "../../../core/middlewares/auth.middleware";
import { EmployeePermissions } from "../../../core/constants";

export class GuestRoute implements IRoute {
  public path = "/guest";
  public router = Router();
  public guestsController = new GuestController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // POST
    this.router.post(
      `${this.path}/`,
      authMiddleware([EmployeePermissions.registerGuest]),
      this.guestsController.registerGuest
    );
    this.router.post(
      [`${this.path}/batch/`, `${this.path}/many/`],
      authMiddleware([EmployeePermissions.registerGuest]),
      this.guestsController.registerManyGuests
    );

    // GET
    this.router.get(
      [`${this.path}/`, `${this.path}/_ids/`],
      authMiddleware([]),
      this.guestsController.findGuests
    );
    this.router.get(
      [`${this.path}/:_id/`, `${this.path}/_id/:_id/`],
      authMiddleware([]),
      this.guestsController.findGuestById
    );

    // PATCH
    this.router.patch(
      [`${this.path}/`, `${this.path}/status/`],
      authMiddleware([EmployeePermissions.updateGuestInfo, EmployeePermissions.bookingARoom]),
      this.guestsController.updateGuests
    );
    this.router.patch(
      `${this.path}/info/`,
      authMiddleware([EmployeePermissions.updateGuestInfo]),
      this.guestsController.updateGuestsInfo
    );
    this.router.patch(
      [`${this.path}/:_id/`, `${this.path}/status/:_id/`],
      authMiddleware([EmployeePermissions.updateGuestInfo, EmployeePermissions.bookingARoom]),
      this.guestsController.updateGuestById
    );
    this.router.patch(
      `${this.path}/info/:_id/`,
      authMiddleware([EmployeePermissions.updateGuestInfo]),
      this.guestsController.updateGuestInfoById
    );

    // DELETE
    this.router.delete(
      `${this.path}/`,
      authMiddleware([EmployeePermissions.updateGuestInfo]),
      this.guestsController.deleteGuests
    );
    this.router.delete(
      [`${this.path}/:_id/`, `${this.path}/_id/:_id/`],
      authMiddleware([EmployeePermissions.updateGuestInfo]),
      this.guestsController.deleteGuestById
    );
  }
}
