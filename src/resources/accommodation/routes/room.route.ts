import { Router } from "express";
import { IRoute } from "../../../core/interfaces/routes.interface";
import { RoomController } from "../controllers/room.controller";
import { authMiddleware } from "../../../core/middlewares/auth.middleware";
import { EmployeePermissions } from "../../../core/constants";

export class RoomRoute implements IRoute {
  public path = "/room";
  public router = Router();
  public roomsController = new RoomController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // POST
    this.router.post(
      `${this.path}/`,
      authMiddleware([EmployeePermissions.createRoom]),
      this.roomsController.createRoom
    );
    this.router.post(
      [`${this.path}/batch/`, `${this.path}/many/`],
      authMiddleware([EmployeePermissions.createRoom]),
      this.roomsController.createManyRooms
    );

    // GET
    this.router.get(
      [`${this.path}/`, `${this.path}/_ids/`],
      authMiddleware([]),
      this.roomsController.findRooms
    );
    this.router.get(
      [`${this.path}/:_id/`, `${this.path}/_id/:_id/`],
      authMiddleware([]),
      this.roomsController.findRoomById
    );

    // PATCH
    this.router.patch(
      [`${this.path}/`, `${this.path}/status/`],
      authMiddleware([EmployeePermissions.updateRoomInfo, EmployeePermissions.updateRoomStatus]),
      this.roomsController.updateRooms
    );
    this.router.patch(
      `${this.path}/info/`,
      authMiddleware([EmployeePermissions.updateRoomInfo]),
      this.roomsController.updateRoomsInfo
    );
    this.router.patch(
      [`${this.path}/:_id/`, `${this.path}/status/:_id/`],
      authMiddleware([EmployeePermissions.updateRoomInfo, EmployeePermissions.updateRoomStatus]),
      this.roomsController.updateRoomById
    );
    this.router.patch(
      `${this.path}/info/:_id/`,
      authMiddleware([EmployeePermissions.updateRoomInfo]),
      this.roomsController.updateRoomInfoById
    );

    // DELETE
    this.router.delete(
      `${this.path}/`,
      authMiddleware([EmployeePermissions.updateRoomInfo, EmployeePermissions.updateRoomStatus]),
      this.roomsController.deleteRooms
    );
    this.router.delete(
      [`${this.path}/:_id/`, `${this.path}/_id/:_id/`],
      authMiddleware([EmployeePermissions.updateRoomInfo, EmployeePermissions.updateRoomStatus]),
      this.roomsController.deleteRoomById
    );
  }
}
