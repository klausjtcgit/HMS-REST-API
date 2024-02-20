import { Document, Model, Schema, Types, model } from "mongoose";
import { RoomTypes, OccupancyStatuses } from "../../../core/constants";
import { isEmpty } from "../../../core/utilities/utilities";

export interface IRoom extends Document {
  number: string;
  type: RoomTypes;
  floor: string;
  isClean: boolean;
  occupancy: OccupancyStatuses;
  isOutOfOrder: boolean;
  note: string[];
  createdAt: Date;
  createdBy: Types.ObjectId;
  updatedAt?: Date;
  updatedBy?: Types.ObjectId;
  deleted: boolean;
}

interface IRoomMethods {}

interface IRoomModel extends Model<IRoom, {}, IRoomMethods> {}

const roomSchema = new Schema<IRoom, IRoomModel, IRoomMethods>({
  number: { type: String, required: true, lowercase: true, unique: true },
  type: { type: String, enum: Object.values(RoomTypes), required: true },
  floor: { type: String, required: true, lowercase: true },
  isClean: { type: Boolean, default: true },
  occupancy: { type: String, enum: Object.values(OccupancyStatuses), required: true },
  note: { type: [String], default: [] },
  createdAt: { type: Date, default: new Date() },
  createdBy: { type: Schema.Types.ObjectId, ref: "Employee" },
  updatedAt: { type: Date },
  updatedBy: { type: Schema.Types.ObjectId, ref: "Employee" },
  deleted: { type: Boolean, default: false },
});

roomSchema.pre("find", async function (next) {
  this.where({ deleted: false });
  next();
});

roomSchema.pre("findOne", async function (next) {
  this.where({ deleted: false });
  next();
});

export const RoomModel = model<IRoom, IRoomModel>("Room", roomSchema);
