export interface Resource<T> {
  type: string;
  version: number;
  name: string;
  description: string;
  data: T;
}
