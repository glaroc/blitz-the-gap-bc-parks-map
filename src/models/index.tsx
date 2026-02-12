export interface IDataProvider<T, U> {
  getData: (param: T) => Promise<U[]>;
}
