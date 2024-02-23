import { Document, Model, Schema, Types, model } from "mongoose";
import {} from "../../../core/constants";
import { isEmpty } from "../../../core/utilities/utilities";

export interface IGuest extends Document {
  firstName: string;
  lastName: string;
  middleName?: string;
  IDNumber: string;
  phone: string;
  email?: string;
  nationality: string;
  isGroup: boolean;
  balance: number;
  registeredAt: Date;
  registeredBy: Types.ObjectId;
  updatedAt?: Date;
  updatedBy?: Types.ObjectId;
  deleted: boolean;
}

interface IGuestMethods {}

interface IGuestModel extends Model<IGuest, {}, IGuestMethods> {}

const guestSchema = new Schema<IGuest, IGuestModel, IGuestMethods>({
  firstName: { type: String, required: true, lowercase: true },
  lastName: { type: String, required: true, lowercase: true },
  middleName: { type: String, lowercase: true },
  IDNumber: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, lowercase: true, unique: true },
  nationality: { type: String, required: true },
  isGroup: { type: Boolean, default: false },
  balance: { type: Number, default: 0 },
  registeredAt: { type: Date, default: new Date() },
  registeredBy: { type: Schema.Types.ObjectId, ref: "Employee" },
  updatedAt: { type: Date },
  updatedBy: { type: Schema.Types.ObjectId, ref: "Employee" },
  deleted: { type: Boolean, default: false },
});

guestSchema.pre("find", async function (next) {
  this.where({ deleted: false });
  next();
});

guestSchema.pre("findOne", async function (next) {
  this.where({ deleted: false });
  next();
});

export const GuestModel = model<IGuest, IGuestModel>("Guest", guestSchema);
