import { ServiceModel } from "../../../core/models/services.model";
import { GuestModel, IGuest } from "../models/guest.model";
import { auditLogging, getGuestFilter } from "../helper/guest.helper";

export class GuestService extends ServiceModel<IGuest> {
  constructor() {
    super("guest", GuestModel, auditLogging, getGuestFilter);
  }
}
