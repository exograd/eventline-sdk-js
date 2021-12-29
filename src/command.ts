import type { Client } from "@ev/client";

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
