// Copyright (c) 2021 Exograd SAS.
//
// Permission to use, copy, modify, and/or distribute this software for
// any purpose with or without fee is hereby granted, provided that the
// above copyright notice and this permission notice appear in all
// copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL
// WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED
// WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE
// AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL
// DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR
// PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
// TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
// PERFORMANCE OF THIS SOFTWARE.

import type { Id } from "@ev";
import type { Client, Pagination, Query, ListResponse } from "@ev/client";

import url from "url";
import { buildPaginationQuery } from "./client";

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
  };
}

export interface TaskStep {
  label?: string;
  command?: string;
  code?: string;
  source?: string;
  arguments?: string;
}

export interface Trigger {
  connector: string;
  event: string;
  identity?: string;
  parameters?: object;
  pipelines: string[];
}

export interface ListResourcesRequest extends Pagination {
  type?: ResourceType;
}

export type ListResourcesResponse<T> = ListResponse<Resource<T>>;

export async function listResources<T>(
  client: Client,
  request: ListResourcesRequest
): Promise<ListResourcesResponse<T>> {
  const q: Query = {};

  buildPaginationQuery(q, request);

  if (request.type !== undefined) q["type"] = request.type;

  return client("GET", url.format({ pathname: "/v0/resources", query: q }));
}

export interface GetResourceRequest {
  id: Id;
}

export type GetResourceResponse<T> = Resource<T>;

export async function getResource<T>(
  client: Client,
  request: GetResourceRequest
): Promise<GetResourceResponse<T>> {
  return client(
    "GET",
    url.format({ pathname: "/v0/resources/id/" + request.id })
  );
}
