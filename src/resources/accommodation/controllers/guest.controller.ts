import { Request, Response, NextFunction } from "express";
import { IGuest } from "../models/guest.model";
import { ControllerModel } from "../../../core/models/controller.model";
import { GuestService } from "../services/guest.service";
import { globalExceptionHandler } from "../../../core/utilities/exception_handler";

export class GuestController extends ControllerModel<IGuest, GuestService> {
  public guestService: GuestService;

  constructor() {
    super("guest", "registered", new GuestService());
    this.guestService = this.service;
  }

  public registerGuest = this.post;
  public registerManyGuests = this.postMany;
  public findGuests = this.get;
  public findGuestById = this.getById;
  public updateGuests = this.patch;
  public updateGuestById = this.patchById;
  public deleteGuests = this.delete;
  public deleteGuestById = this.deleteById;

  public updateGuestsInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      delete req.body.balance;

      this.updateGuestById(req, res, next);
    } catch (error) {
      globalExceptionHandler(error, next);
    }
  };

  public updateGuestInfoById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      delete req.body.balance;

      this.updateGuestById(req, res, next);
    } catch (error) {
      globalExceptionHandler(error, next);
    }
  };
}
