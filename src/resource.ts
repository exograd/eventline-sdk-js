import type { Id } from "@ev";
import type { Client, ListResponse } from "@ev/client";

import url from "url";

export interface Resource<T> {
  id: Id;
  org_id: Id;
  project_id: Id;
  disabled: boolean;
  creation_time: string;
  update_time: string;
  spec: ResourceSpec<T>;
}

export type ResourceType = "command" | "pipeline" | "task" | "trigger";

export interface ResourceSpec<T> {
  type: ResourceType;
  version: 1;
  name: string;
  description?: string;
  data: T;
}

export interface Command {
  parameters: Parameter[];
  pipelines: string[];
}

export interface Parameter {
  name: string;
  type: "string" | "number" | "boolean";
  values?: string[];
  default?: string;
  description?: string;
  environment?: string;
}

export interface Pipeline {
  concurrent?: boolean;
  tasks: PipelineTask[];
}

export interface PipelineTask {
  name?: string;
  label?: string;
  task: string;
  parameters?: object;
  dependencies?: string[];
  on_failure?: "abort" | "continue";
  nb_instances?: number;
  nb_retries?: number;
  retry_delay?: number;
}

export interface Task {
  runtime: TaskRuntime;
  steps: TaskStep[];
  environment?: Record<string, string>;
  identities?: string[];
  parameters?: Parameter[];
}

export interface TaskRuntime {
  name: "container";
  parameters: {
    image: string;
    host_type?: "small" | "medium" | "large";
    registry_identities?: string[];
    extra_containers?: {
      name: string;
      image: string;
      command?: string;
      arguments?: string[];
      environment: Record<string, string>;
    }[];
  }
}

export interface TaskStep {
  label?: string;
  command?: string;
  code?: string;
  source?: string;
  arguments?: string;
}

export interface ListResourcesRequest {
  type?: ResourceType;
  after?: Id;
  size?: number;
}

export type ListResourcesResponse<T> = ListResponse<Resource<T>>;

export async function listResources<T>(
  client: Client,
  request: ListResourcesRequest
): Promise<ListResourcesResponse<T>> {
  const query: Record<string, string> = {};

  if (request.type !== undefined) query.type = request.type;
  if (request.after !== undefined) query.after = request.after;
  if (request.size !== undefined) query.size = request.size.toString();

  return client("GET", url.format({ pathname: "/v0/resources", query: query }));
}

export interface GetResourceRequest {
  by?: "id" | "name";
  id: string;
}

export type GetResourceResponse<T> = Resource<T>;

export async function getResource<T>(
  client: Client,
  request: GetResourceRequest
): Promise<GetResourceResponse<T>> {
  const by = request.by ?? "id";

  return client(
    "GET",
    url.format({ pathname: "/v0/resources/" + by + "/" + request.id })
  );
}
