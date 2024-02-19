import { NextFunction, Request, Response } from "express";
import { Document } from "mongoose";
import pluralize from "pluralize";
import { HTTPCodes } from "../constants";
import { ServiceModel } from "./services.model";
import { ResponseModel } from "./response.model";
import { TMap, isEmpty, isObjectId } from "../utilities/utilities";
import {
  globalExceptionHandler,
  invalidObjectIdExceptionHandler,
  noUpdateExceptionHandler,
} from "../utilities/exception_handler";
import { toQueryModel } from "../utilities/conversion_helpers";
import {
  IDeleteResponse,
  IInsertResponse,
  IUpdateResponse,
  Unaffected,
} from "../interfaces/write_responses.interface";

const defaultWriter: string = "65ba85fd7e2eb77ce3f67a0c";

export class ControllerModel<
  IDocument extends Document,
  ServiceModelType extends ServiceModel<IDocument>
> {
  constructor(
    public resourceName: string,
    public createdAlias: string,
    public service: ServiceModelType
  ) {}

  private patchResultSanitizer(result: IUpdateResponse<IDocument>): IUpdateResponse<IDocument> {
    const sanitizedUpdated: any[] = result.updated.map((resource: IDocument) => {
      const { code, password, deleted, ...sanitized } = resource.toObject();
      return sanitized;
    });

    const sanitizedNotUpdated: any[] = result.notUpdated.map((resource: Unaffected<IDocument>) => {
      const { code, password, deleted, ...sanitized } = resource.document.toObject();
      return { document: sanitized, reason: resource.reason };
    });

    return {
      updated: sanitizedUpdated,
      notUpdated: sanitizedNotUpdated,
      updatedCount: result.updatedCount,
      notUpdatedCount: result.notUpdatedCount,
    } as IUpdateResponse<IDocument>;
  }

  private deleteResultSanitizer(result: IDeleteResponse<IDocument>): IDeleteResponse<IDocument> {
    const sanitizedDeleted: any[] = result.deleted.map((resource: IDocument) => {
      const { code, password, deleted, ...sanitized } = resource.toObject();
      return sanitized;
    });

    const sanitizedNotDeleted: any[] = result.notDeleted.map((resource: Unaffected<IDocument>) => {
      const { code, password, deleted, ...sanitized } = resource.document.toObject();
      return { document: sanitized, reason: resource.reason };
    });

    return {
      deleted: sanitizedDeleted,
      notDeleted: sanitizedNotDeleted,
      deletedCount: result.deletedCount,
      notDeletedCount: result.notDeletedCount,
    } as IDeleteResponse<IDocument>;
  }

  post = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resource: IDocument = await this.service.create({
        ...req.body,
        [`${this.createdAlias}At`]: new Date(),
        [`${this.createdAlias}By`]: req.body.employee__id ?? defaultWriter,
      });

      const { code, password, deleted, ...sanitizedResource } = resource.toObject();

      res.status(HTTPCodes.CREATED).json(
        new ResponseModel({
          success: true,
          message: `${this.resourceName} inserted successfully.`,
          data: { inserted: sanitizedResource },
        })
      );
    } catch (error) {
      globalExceptionHandler(error, next);
    }
  };

  postMany = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const insertResult: IInsertResponse<IDocument> = await this.service.createMany(
        (Array.isArray(req.body) ? req.body : [req.body]).map((resource) => {
          return {
            ...resource,
            [`${this.createdAlias}At`]: new Date(),
            [`${this.createdAlias}By`]: req.body.employee__id ?? defaultWriter,
          };
        })
      );

      const statusCode: HTTPCodes =
        insertResult.insertedCount > 0 ? HTTPCodes.CREATED : HTTPCodes.OK;

      const sanitizedInserted: TMap[] = insertResult.inserted.map((resource: IDocument) => {
        const { code, password, deleted, ...sanitized } = resource.toObject();
        return sanitized;
      });

      const sanitizedNotInserted: TMap[] = insertResult.notInserted.map(
        (resource: Unaffected<IDocument>) => {
          const { code, password, deleted, ...sanitized } = resource.document.toObject();
          return { document: sanitized, reason: resource.reason };
        }
      );

      res.status(statusCode).json(
        new ResponseModel({
          success: true,
          message: `${pluralize(this.resourceName)} inserted successfully`,
          data: {
            inserted: sanitizedInserted,
            notInserted: sanitizedNotInserted,
            insertedCount: insertResult.insertedCount,
            notInsertedCount: insertResult.notInsertedCount,
          } as IInsertResponse<IDocument>,
        })
      );
    } catch (error: any) {
      globalExceptionHandler(error, next);
    }
  };

  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resources: IDocument[] = await this.service.read(toQueryModel(req.query));

      const sanitizedResources: TMap[] = resources.map((resource: IDocument) => {
        const { code, password, deleted, ...sanitizedResource } = resource.toObject();
        return sanitizedResource;
      });

      res.status(HTTPCodes.OK).json(
        new ResponseModel({
          success: true,
          message: `${pluralize(this.resourceName)} retrieved successfully.`,
          data: { retrieved: sanitizedResources, matchCount: sanitizedResources.length },
        })
      );
    } catch (error) {
      globalExceptionHandler(error, next);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!isObjectId(req.params._id)) {
        invalidObjectIdExceptionHandler(req.params._id);
      } else {
        const resource: IDocument = await this.service.readById(req.params._id!.toString());

        const { code, password, deleted, ...sanitizedResource } = resource.toObject();

        res.status(HTTPCodes.OK).json(
          new ResponseModel({
            success: true,
            message: `${this.resourceName} retrieved successfully.`,
            data: { retrieved: sanitizedResource },
          })
        );
      }
    } catch (error) {
      globalExceptionHandler(error, next);
    }
  };

  patch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { employee__id, deleted, ...update } = req.body;

      if (isEmpty(update)) {
        noUpdateExceptionHandler(pluralize(this.resourceName));
      } else {
        const result = this.patchResultSanitizer(
          await this.service.update(toQueryModel(req.query), {
            ...update,
            updatedBy: employee__id ?? defaultWriter,
            updatedAt: new Date(),
          })
        );

        const message: string =
          result.updatedCount === 0 && result.notUpdatedCount === 0
            ? `No ${pluralize(this.resourceName)} matched for the update.`
            : result.updatedCount === 0 && result.notUpdatedCount > 0
            ? `All matched ${pluralize(
                this.resourceName
              )} already contain the same data as the new data. No changes were made.`
            : result.updatedCount > 0 && result.notUpdatedCount === 0
            ? `All matched ${pluralize(this.resourceName)} were updated successfully.`
            : `Some matched ${pluralize(
                this.resourceName
              )} were updated, while others already contain the same data as the new data.`;

        res.status(HTTPCodes.OK).json(
          new ResponseModel({
            success: true,
            message: message,
            data: result as IUpdateResponse<IDocument>,
          })
        );
      }
    } catch (error) {
      globalExceptionHandler(error, next);
    }
  };

  patchById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { employee__id, deleted, ...update } = req.body;

      if (!isObjectId(req.params._id)) {
        invalidObjectIdExceptionHandler(req.params._id);
      } else if (isEmpty(update)) {
        noUpdateExceptionHandler(this.resourceName);
      } else {
        const result = this.patchResultSanitizer(
          await this.service.updateById(req.params._id!.toString(), {
            ...update,
            updatedBy: employee__id ?? defaultWriter,
            updatedAt: new Date(),
          })
        );

        const message: string =
          result.updatedCount > 0
            ? `${this.resourceName} updated successfully.`
            : result.notUpdatedCount > 0
            ? `No changes were made because the provided data is the same as the current data.`
            : `No ${this.resourceName} matched for the update.`;

        res.status(HTTPCodes.OK).json(
          new ResponseModel({
            success: true,
            message: message,
            data: result as IUpdateResponse<IDocument>,
          })
        );
      }
    } catch (error) {
      globalExceptionHandler(error, next);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = this.deleteResultSanitizer(
        await this.service.delete(toQueryModel(req.query), req.body.employee__id)
      );

      const message: string =
        result.deletedCount === 0 && result.notDeletedCount === 0
          ? `No ${pluralize(this.resourceName)} matched for the deletion.`
          : result.deletedCount > 0 && result.notDeletedCount === 0
          ? `All matched ${pluralize(this.resourceName)} were deleted successfully.`
          : `Some matched ${pluralize(
              this.resourceName
            )} were deleted, but not all, due to some reason.`;

      res.status(HTTPCodes.OK).json(
        new ResponseModel({
          success: true,
          message: message,
          data: result as IDeleteResponse<IDocument>,
        })
      );
    } catch (error) {
      globalExceptionHandler(error, next);
    }
  };

  deleteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!isObjectId(req.params._id)) {
        invalidObjectIdExceptionHandler(req.params._id);
      } else {
        const result = this.deleteResultSanitizer(
          await this.service.deleteById(req.params._id!.toString(), req.body.employee__id)
        );

        const message: string =
          result.deletedCount > 0
            ? `${this.resourceName} deleted successfully.`
            : result.notDeletedCount > 0
            ? `No changes were made because the provided data is the same as the current data.`
            : `No ${this.resourceName} matched for the update.`;

        res.status(HTTPCodes.OK).json(
          new ResponseModel({
            success: true,
            message: message,
            data: result as IDeleteResponse<IDocument>,
          })
        );
      }
    } catch (error) {
      globalExceptionHandler(error, next);
    }
  };
}
