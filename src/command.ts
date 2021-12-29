import type { Client } from "@ev/client";
import type {
  Resource,
  ListResourcesRequest,
  ListResourcesResponse,
  GetResourceRequest,
  GetResourceResponse,
} from "@ev/resource";

import { listResources, getResource } from "@ev/resource";

export interface Command {
  parameters: {
    default?: string;
    environment?: string;
    name: string;
    values?: string[];
    description?: string;
    type: "string" | "number" | "boolean";
  }[];
  pipelines: string[];
}

export type ListCommandsRequest = Pick<ListResourcesRequest, "after" | "size">;

export type ListCommandsResponse = ListResourcesResponse<Command>;

export async function listCommands(
  client: Client,
  request: ListCommandsRequest
): Promise<ListCommandsResponse> {
  return listResources(client, { type: "command", ...request });
}

export type GetCommandRequest = GetResourceRequest;

export type GetCommandResponse = GetResourceResponse<Command>;

export async function getCommand(
  client: Client,
  request: GetCommandRequest
): Promise<GetCommandResponse> {
  return getResource(client, request);
}

export interface ExecuteCommandRequest {
  id: string;
  parameters: Record<string, string | number | boolean>;
}

export interface ExecuteCommandResponse {
  pipeline_ids: string[];
}

export async function executeCommand(
  client: Client,
  request: ExecuteCommandRequest
): Promise<ExecuteCommandRequest> {
  const data = JSON.stringify(request.parameters);
  const url = "/v0/commands/id/" + request.id + "/execute";
  return client("POST", url, data);
}
