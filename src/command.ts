import type { Id } from "@ev";
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
