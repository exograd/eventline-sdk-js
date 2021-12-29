export interface Parameter {
  name: string;
  type: "string" | "number" | "boolean";
  values?: string[];
  default?: string;
  description?: string;
  environment?: string;
}
