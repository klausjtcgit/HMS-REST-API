export type TMap = Record<string, any>;

export const isEmpty = (value: any): boolean => {
  return value == null || value === "" || (typeof value === "object" && !Object.keys(value).length);
};
