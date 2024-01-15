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
