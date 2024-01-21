import { MAX_LIMIT } from "../constants";

export type TFilterValue = {
  range?: { gt?: string; gte?: string; lt?: string; lte?: string; not?: string };
  equal?: string;
};

interface IQuery {
  filter?: Record<string, TFilterValue>;
  select?: Record<string, 0 | 1>;
  sort?: Record<string, -1 | 1>;
  limit?: number;
  skip?: number;
}

export class QueryModel implements IQuery {
  public filter: Record<string, TFilterValue>;
  public select: Record<string, 0 | 1>;
  public sort: Record<string, -1 | 1>;
  public limit: number;
  public skip: number;

  constructor({ filter, select, sort, limit, skip }: IQuery) {
    this.filter = filter ?? {};
    this.select = select ?? {};
    this.sort = sort ?? {};
    this.limit = limit ?? MAX_LIMIT;
    this.skip = skip ?? 0;
  }
}
