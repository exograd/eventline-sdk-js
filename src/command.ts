import type { Id } from "@ev";
import type { Client } from "@ev/client";
import type { Resource } from "@ev/resource";

import { makeClient } from "@ev/client";

export interface Command {
  id: Id;
  org_id: Id;
  project_id: Id;
  creation_time: string;
  update_time: string;
  disabled: boolean;

  spec: Resource<CommandData>;
}

export interface CommandData {
  parameters: CommandParameter[];
  pipelines: string[];
}

export interface CommandParameter {
  default?: string;
  environment?: string;
  name: string;
  values?: string[];
  description?: string;
  type: "string" | "number" | "boolean";
}

export interface GetCommandByNameRequest {
  name: string;
}

export type GetCommandByNameResponse = Promise<Command>;

export async function getCommandByName(
  client: Client,
  request: GetCommandByNameRequest
): GetCommandByNameResponse {
  const command: Command = await client(
    "GET",
    "/v0/commands/name/" + request.name
  );
  return command;
}
