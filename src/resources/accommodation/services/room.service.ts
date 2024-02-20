import { ServiceModel } from "../../../core/models/services.model";
import { RoomModel, IRoom } from "../models/room.model";
import { auditLogging, getRoomFilter } from "../helper/room.helper";

export class RoomService extends ServiceModel<IRoom> {
  constructor() {
    super("room", RoomModel, auditLogging, getRoomFilter);
  }
}
