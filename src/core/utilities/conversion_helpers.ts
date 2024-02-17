import { QueryModel, TFilterValue } from "../models/query.model";
import { isEmpty } from "./utilities";

export const toNumber = (rawInput: any): number | undefined => {
  const output: number = parseFloat(rawInput);

  return isNaN(output) ? undefined : output;
};

export const toBoolean = (rawInput: any): boolean | undefined => {
  if (isEmpty(rawInput)) return undefined;
  else return ![false, "false", "no", 0].includes(rawInput);
};

export const toDatetime = (rawInput: any): Date | undefined => {
  const output: Date = new Date(Date.parse(rawInput));

  return isNaN(output.getTime()) ? undefined : output;
};

export const stringifyDate = (date: Date = new Date()): string =>
  `${date.toLocaleString("en-CA", {
    hour12: false,
  })}.${date.getMilliseconds().toString().padStart(3, "0")}`.replace(", ", "T");

/**
 * Convert a query object into a QueryModel.
 * @param {any} query - The query object containing parameters like select, sort, filter, limit, skip, etc.
 * @returns {QueryModel} - A QueryModel instance representing the converted query.
 *
 *
 * @example
 * general example
 * const request.query = {
 *   name: "anne", // this is a filter.
 *   select: "name,age",  // will return only name & age fields. But '-name,age' would result in the exclusion of those fields and inclusion of the unlisted fields of the collection/table
 *   sort: "createdAt,-updatedAt",  // Sort by 'createdAt' in ascending order and 'updatedAt' in descending order
 *   limit: 10, // default=src/core/constants/index.ts.MAX_LIMIT
 *   skip: 20, // default=0
 * };
 *
 * @example
 * filter showcase
 *
 * const queryModel = toQueryModel(queryObject);
 * console.log(queryModel);
 *
 * const request.query = {
 *   "amount": "2025", // amount="2025".
 *   "amount>": "2025", // amount>="2025".
 *   "amount<": "2025", // amount<="2025".
 *   "amount!": "2025", // amount!="2025".
 *   "amount!2025": "", // amount!="2025".
 *   "amount>2025": "", // amount>"2025".
 *   "amount<2025": "", // amount<="2025".
 * };
 *
 * I know this look weird but that is just how express.js parses the request.query.
 * Here are some examples of the query string and their parsed version.
 * url?amount=2025 => {amount: 2025}
 * url?amount>=2025 => { "amount>": "2025" }
 * url?amount>2025 => { "amount>2025": "" }
 * url?age!=25 => { "age!": "25" }
 *
 *
 * @note keywords such as ["select", "fields", "project", "show", "sort", "order", "sortBy", "orderBy"]
 * @note and are excluded from the filter by default
 *
 * @note select can be one of those keys ["select", "fields", "project", "show"]
 * @note sort can be one of those keys ["sort", "order", "sortBy", "orderBy"]
 *
 * @note if there are equality and inequality filter for the same field equality is take over inequality
 */
export const toQueryModel = (query: any): QueryModel => {
  const selectQuery: string = query.select || query.fields || query.project || query.show;
  const hideSelected: 0 | 1 = !isEmpty(selectQuery) && selectQuery.startsWith("-") ? 0 : 1;
  const select: Record<string, 0 | 1> | undefined = selectQuery
    ? Object.fromEntries(
        (selectQuery.startsWith("+") || selectQuery.startsWith("-")
          ? selectQuery.slice(1)
          : selectQuery
        )
          .split(",")
          .map((field: string) => [field, hideSelected])
          .filter((_) => _[0] !== "")
      )
    : undefined;

  const sortQuery: string = query.sort || query.order || query.sortBy || query.orderBy;
  const sort: Record<string, -1 | 1> | undefined = sortQuery
    ? Object.fromEntries(
        sortQuery.split(",").map((field: string) => {
          if (field.includes("-")) return [field.slice(1), -1];
          else if (field.includes("+")) return [field.slice(1), 1];
          else return [field, 1];
        })
      )
    : undefined;

  const filter: Record<string, TFilterValue> | undefined = Object.fromEntries(
    Object.entries(query).reduce((accumulated: [string, TFilterValue][], [key, value]) => {
      // TODO: indicate in the readme.md that filter with those fields is will be ignored.
      // & the reason being we use those words as a key word.
      if (
        ![
          "select",
          "fields",
          "project",
          "show",
          "sort",
          "order",
          "sortBy",
          "orderBy",
          "limit",
          "skip",
        ].includes(key)
      ) {
        let index = accumulated.findIndex((field) => field[0] === key.split(/[><!]/)[0]);

        if (index === -1) {
          accumulated.push([key.split(/[><!]/)[0], {}]);
          index = accumulated.length - 1;
        }

        if (accumulated[index][0] === key) {
          accumulated[index][1].equal = value as string;
          accumulated[index][1].range = undefined;
        } else if (accumulated[index][1].equal === undefined) {
          if (accumulated[index][1].range === undefined) accumulated[index][1].range = {};

          if (key.endsWith(">")) {
            accumulated[index][1].range!.gte = value as string;
          } else if (key.endsWith("<")) {
            accumulated[index][1].range!.lte = value as string;
          } else if (key.endsWith("!")) {
            accumulated[index][1].range!.not = value as string;
          } else if (key.includes(">")) {
            accumulated[index][1].range!.gt = key.split(">")[1];
          } else if (key.includes("<")) {
            accumulated[index][1].range!.lt = key.split("<")[1];
          } else if (key.includes("!")) {
            accumulated[index][1].range!.not = key.split("!")[1];
          }
        }
      }
      return accumulated;
    }, [] as [string, TFilterValue][])
  );

  return new QueryModel({
    filter,
    select,
    sort,
    limit: query.limit,
    skip: query.skip,
  });
};
