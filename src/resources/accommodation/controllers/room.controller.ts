import { Request, Response, NextFunction } from "express";
import { IRoom } from "../models/room.model";
import { ControllerModel } from "../../../core/models/controller.model";
import { RoomService } from "../services/room.service";
import { globalExceptionHandler } from "../../../core/utilities/exception_handler";

export class RoomController extends ControllerModel<IRoom, RoomService> {
  public roomService: RoomService;

  constructor() {
    super("room", "created", new RoomService());
    this.roomService = this.service;
  }

  public createRoom = this.post;
  public createManyRooms = this.postMany;
  public findRooms = this.get;
  public findRoomById = this.getById;
  public updateRooms = this.patch;
  public updateRoomById = this.patchById;
  public deleteRooms = this.delete;
  public deleteRoomById = this.deleteById;

  public updateRoomsInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      delete req.body.isClean;
      delete req.body.occupancy;
      delete req.body.isOutOfOrder;

      this.updateRoomById(req, res, next);
    } catch (error) {
      globalExceptionHandler(error, next);
    }
  };

  public updateRoomInfoById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      delete req.body.isClean;
      delete req.body.occupancy;
      delete req.body.isOutOfOrder;

      this.updateRoomById(req, res, next);
    } catch (error) {
      globalExceptionHandler(error, next);
    }
  };
}
