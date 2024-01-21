export interface IUpdateResponse<Model> {
  affected: Model[];
  count: {
    matched: number;
    affected: number;
  };
}
