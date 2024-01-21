import { QueryModel } from "../models/query.model";
import { IUpdateResponse } from "./update_response.interface";
import { TMap } from "../utilities/utilities";

export interface IService<
  DefaultType,
  CreateReturnType = DefaultType,
  ReadReturnType = DefaultType[],
  UpdateReturnType = IUpdateResponse<DefaultType>,
  DeleteReturnType = IUpdateResponse<DefaultType>,
  CreateManyReturnType = DefaultType[],
  ReadOneReturnType = DefaultType,
  UpdateOneReturnType = IUpdateResponse<DefaultType>,
  DeleteOneReturnType = IUpdateResponse<DefaultType>
> {
  create: (newDocument: DefaultType) => Promise<CreateReturnType>;
  createMany: (newDocument: DefaultType[]) => Promise<CreateManyReturnType>;

  read: (query: QueryModel) => Promise<ReadReturnType>;
  readById: (_id: string) => Promise<ReadOneReturnType>;

  update: (query: QueryModel, update: TMap) => Promise<UpdateReturnType>;
  updateById: (_id: string, update: TMap) => Promise<UpdateOneReturnType>;

  delete: (query: QueryModel, deleteBy: string) => Promise<DeleteReturnType>;
  deleteById: (_id: string, deleteBy: string) => Promise<DeleteOneReturnType>;
}
