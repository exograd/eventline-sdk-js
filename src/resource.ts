import type { Id } from "@ev";
import type { Client } from "@ev/client";

import url from "url";

export interface ListResponse<T> {
  elements: T[];
  next?: {
    after: Id;
    size: number;
  };
  previous: {
    before: Id;
    size: number;
  };
}

export interface Resource<T> {
  id: Id;
  org_id: Id;
  project_id: Id;
  disabled: boolean;
  creation_time: string;
  update_time: string;
  spec: ResourceSpec<T>;
}

export interface ResourceSpec<T> {
  type: string;
  version: 1;
  name: string;
  description?: string;
  data: T;
}

export type ResourceType = "command" | "task" | "pipeline" | "trigger";

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
