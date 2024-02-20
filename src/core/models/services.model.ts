import { Document, Model } from "mongoose";
import { QueryModel } from "./query.model";
import { IUpdate } from "../interfaces/update.interface";
import {
  IDeleteResponse,
  IInsertResponse,
  IUpdateResponse,
} from "../interfaces/write_responses.interface";
import { FilterExtractorFunction, LoggingFunction, isEmpty } from "../utilities/utilities";
import { notFoundExceptionHandler } from "../utilities/exception_handler";

export class ServiceModel<IDocument extends Document> {
  constructor(
    public documentName: string,
    public documentModel: Model<IDocument>,
    public auditLogger: LoggingFunction,
    public filterExtractor: FilterExtractorFunction
  ) {}

  async create(newDocument: IDocument): Promise<IDocument> {
    const document: IDocument = await this.documentModel.create(newDocument);
    this.auditLogger("create", document.toObject());

    return document;
  }

  async createMany(newDocuments: IDocument[]): Promise<IInsertResponse<IDocument>> {
    let insertionResult: IInsertResponse<IDocument> = {
      inserted: [],
      notInserted: [],
      insertedCount: 0,
      notInsertedCount: 0,
    };

    let currentIndex: number = 0;
    let failsafe: number = newDocuments.length;

    while (newDocuments.length >= currentIndex) {
      try {
        const insertedDocuments: IDocument[] = await this.documentModel.insertMany(
          newDocuments.slice(currentIndex, newDocuments.length)
        );
        insertionResult.inserted.push(...insertedDocuments);

        currentIndex += insertedDocuments.length + 1;
      } catch (error: any) {
        if (error.name === "MongoBulkWriteError") {
          insertionResult.inserted.push(...error.insertedDocs);

          insertionResult.notInserted.push({
            document: new this.documentModel(error.writeErrors[0].err.op),
            reason: String(error.writeErrors[0].err.errmsg)
              .replace("E11000", "")
              .replace(/collection.*index: (code_1 )?/g, "")
              .trim(),
          });

          currentIndex += error.insertedDocs.length + 1;
        } else {
          insertionResult.notInserted.push({
            document: new this.documentModel(newDocuments[currentIndex]),
            reason: "unknown error occurred",
          });

          currentIndex += 1;
        }
      }

      // I just can't trust my code. you know what I mean 😅
      failsafe -= 1;
      if (failsafe === 0) break;
    }

    insertionResult.inserted.forEach((document: IDocument) => {
      this.auditLogger("create", document.toObject());
    });

    insertionResult.insertedCount = insertionResult.inserted.length;
    insertionResult.notInsertedCount = insertionResult.notInserted.length;

    return insertionResult;
  }

  async read(query: QueryModel, limited: boolean = true): Promise<IDocument[]> {
    const documents = limited
      ? await this.documentModel
          .find(this.filterExtractor(query.filter))
          .limit(query.limit)
          .skip(query.skip)
          .sort(query.sort)
          .select(query.select)
      : await this.documentModel
          .find(this.filterExtractor(query.filter))
          .skip(query.skip)
          .sort(query.sort)
          .select(query.select);

    return documents;
  }

  async readById(_id: string): Promise<IDocument> {
    const document = await this.documentModel.findById(_id);

    if (!document) notFoundExceptionHandler(this.documentName);
    else return document;
  }

  async update(query: QueryModel, update: IUpdate): Promise<IUpdateResponse<IDocument>> {
    const documents: IDocument[] = await this.read(query, false);

    let updated: IDocument[] = [];
    let notUpdated: { document: IDocument; reason: string }[] = [];

    for (let i = 0; i < documents.length; i++) {
      const oldDocument: IDocument = documents[i].$clone();
      documents[i].$set(update);

      const changes: any = documents[i].getChanges().$set;

      const hasChanges =
        !isEmpty(changes) &&
        Object.keys(changes).some((key) => key !== "updatedAt" && key !== "updatedBy");

      if (hasChanges) {
        try {
          await documents[i].save();
          updated.push(documents[i]);
          this.auditLogger("update", {
            _id: documents[i].id,
            updatedAt: update.updatedAt,
            updatedBy: update.updatedBy,
            ...changes,
          });
        } catch (error: any) {
          if (error.name === "ValidationError" || error.code === 11000) throw error;
          else notUpdated.push({ document: oldDocument, reason: error.toString() });
        }
      } else
        notUpdated.push({
          document: oldDocument,
          reason: "No changes were made because the provided data is the same as the current data",
        });
    }

    return {
      updated,
      notUpdated,
      updatedCount: updated.length,
      notUpdatedCount: notUpdated.length,
    };
  }

  async updateById(_id: string, update: IUpdate): Promise<IUpdateResponse<IDocument>> {
    const document: IDocument = await this.readById(_id);

    const oldDocument: IDocument = document.$clone();

    document.$set(update);

    const changes: any = document.getChanges().$set;

    const hasChanges =
      !isEmpty(changes) &&
      Object.keys(changes).some((key) => key !== "updatedAt" && key !== "updatedBy");

    if (hasChanges) {
      try {
        await document.save();
        this.auditLogger("update", {
          _id: document.id,
          updatedAt: update.updatedAt,
          updatedBy: update.updatedBy,
          changes,
        });

        return { updated: [document], notUpdated: [], updatedCount: 1, notUpdatedCount: 0 };
      } catch (error: any) {
        return {
          updated: [],
          notUpdated: [{ document: oldDocument, reason: error.toString() }],
          updatedCount: 0,
          notUpdatedCount: 1,
        };
      }
    } else
      return {
        updated: [],
        notUpdated: [
          {
            document: oldDocument,
            reason:
              "No changes were made because the provided data is the same as the current data",
          },
        ],
        updatedCount: 0,
        notUpdatedCount: 1,
      };
  }

  async delete(query: QueryModel, deletedBy: string): Promise<IDeleteResponse<IDocument>> {
    const documents: IDocument[] = await this.read(query, false);

    let deleted: IDocument[] = [];
    let notDeleted: { document: IDocument; reason: string }[] = [];
    const update: any = { deleted: true, deletedBy: deletedBy, deletedAt: new Date() };

    for (let i = 0; i < documents.length; i++) {
      const oldDocument: IDocument = documents[i].$clone();
      documents[i].$set(update);

      const changes: any = documents[i].getChanges().$set;

      try {
        await documents[i].save();
        deleted.push(documents[i]);
        this.auditLogger("delete", {
          _id: documents[i].id,
          updatedAt: update.deletedAtAt,
          updatedBy: deletedBy,
          changes,
          ...changes,
        });
      } catch (error: any) {
        notDeleted.push({
          document: oldDocument,
          reason: error.toString(),
        });
      }
    }

    return {
      deleted,
      notDeleted,
      deletedCount: deleted.length,
      notDeletedCount: notDeleted.length,
    };
  }

  async deleteById(_id: string, deletedBy: string): Promise<IDeleteResponse<IDocument>> {
    const document: IDocument = await this.readById(_id);
    const update: any = { deleted: true, updatedBy: deletedBy, updatedAt: new Date() };

    const oldDocument: IDocument = document.$clone();

    document.$set(update);

    const changes: any = document.getChanges().$set;

    try {
      await document.save();
      this.auditLogger("delete", {
        _id: document.id,
        updatedAt: update.deletedAtAt,
        updatedBy: deletedBy,
        changes,
        ...changes,
      });

      return { deleted: [document], notDeleted: [], deletedCount: 1, notDeletedCount: 0 };
    } catch (error: any) {
      return {
        deleted: [],
        notDeleted: [{ document: oldDocument, reason: error.toString() }],
        deletedCount: 0,
        notDeletedCount: 1,
      };
    }
  }
}
