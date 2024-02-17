import { Document, Model, Schema, Types, model } from "mongoose";
import { compare, genSaltSync, hashSync } from "bcryptjs";
import { EmployeePermissions, JobTitles } from "../../../core/constants";
import { isEmpty } from "../../../core/utilities/utilities";

export interface IEmployee extends Document {
  firstName: string;
  lastName: string;
  middleName: string;
  phone: string;
  jobTitle: JobTitles;
  code: string;
  password: string;
  email?: string;
  isActive: boolean;
  permissions: EmployeePermissions[];
  createdAt: Date;
  createdBy: Types.ObjectId;
  updatedAt?: Date;
  updatedBy?: Types.ObjectId;
  deleted: boolean;
}

interface IEmployeeMethods {
  matchPassword(password: string): Promise<boolean>;
}

interface IEmployeeModel extends Model<IEmployee, {}, IEmployeeMethods> {}

const employeeSchema = new Schema<IEmployee, IEmployeeModel, IEmployeeMethods>({
  firstName: { type: String, required: true, lowercase: true },
  lastName: { type: String, required: true, lowercase: true },
  middleName: { type: String, lowercase: true },
  phone: { type: String, required: true, unique: true },
  jobTitle: {
    type: String,
    enum: Object.values(JobTitles),
    required: true,
  },
  code: { type: String, required: true, unique: true, match: /^\d{4,10}$/ },
  password: { type: String, required: true },
  email: { type: String },
  isActive: { type: Boolean, default: true },
  permissions: {
    type: [
      {
        type: String,
        enum: Object.values(EmployeePermissions),
      },
    ],
    required: true,
  },
  createdAt: { type: Date, default: new Date() },
  createdBy: { type: Schema.Types.ObjectId, ref: "Employee" },
  updatedAt: { type: Date },
  updatedBy: { type: Schema.Types.ObjectId, ref: "Employee" },
  deleted: { type: Boolean, default: false },
});

employeeSchema.method(
  "matchPassword",
  async function matchPassword(password: string): Promise<boolean> {
    try {
      return await compare(password, this.password);
    } catch (error) {
      throw error;
    }
  }
);

employeeSchema.pre("find", async function (next) {
  this.where({ deleted: false });
  next();
});

employeeSchema.pre("findOne", async function (next) {
  this.where({ deleted: false });
  next();
});

employeeSchema.pre(/^(save|updateOne)$/, { document: true }, async function (next) {
  if (this.isModified("password") || this.isNew) {
    const salt = genSaltSync(10);
    const hashed = hashSync(this.password, salt);
    this.password = hashed;
    next();
  } else {
    return next();
  }
});

employeeSchema.pre(/^(save|updateOne)$/, { document: true }, async function (next) {
  if (this.isNew) {
    this.createdAt = new Date();
  } else if (!isEmpty(this.getChanges().$set)) {
    this.$set({ updatedAt: new Date() });
  }
  next();
});

export const EmployeeModel = model<IEmployee, IEmployeeModel>("Employee", employeeSchema);
