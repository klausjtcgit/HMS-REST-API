export interface Unaffected<Model> {
  document: Model;
  reason: any;
}

export interface IInsertResponse<Model> {
  inserted: Model[];
  notInserted: Unaffected<Model>[];
  insertedCount: number;
  notInsertedCount: number;
}

export interface IUpdateResponse<Model> {
  updated: Model[];
  notUpdated: Unaffected<Model>[];
  updatedCount: number;
  notUpdatedCount: number;
}

export interface IDeleteResponse<Model> {
  deleted: Model[];
  notDeleted: Unaffected<Model>[];
  deletedCount: number;
  notDeletedCount: number;
}
