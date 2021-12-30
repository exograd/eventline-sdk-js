import type { Id } from "@ev";
import type { Client, ListResponse } from "@ev/client";

import url from "url";

export interface Event {
  id: Id;
  org_id: Id;
  trigger_id?: Id;
  command_id?: Id;
  creation_time: string;
  event_time: string;
  name: string;
  data: Object;
}

export interface ListEventsRequest {
  after?: Id;
  size?: number;
  pipelineId?: Id;
  connector?: string;
  name?: string;
}

export type ListEventsResponse = ListResponse<Event>;

export async function listEvents(
  client: Client,
  request: ListEventsRequest
): Promise<ListEventsResponse> {
  const query: Record<string, string> = {};

  if (request.after !== undefined) query.after = request.after;
  if (request.size !== undefined) query.size = request.size.toString();
  if (request.pipelineId !== undefined) query.pipeline_id = request.pipelineId;

  return client("GET", url.format({ pathname: "/v0/events", query: query }));
}

export interface GetEventRequest {
  id: string;
}

export type GetEventResponse = Event;

export async function getEvent(
  client: Client,
  request: GetEventRequest
): Promise<GetEventResponse> {
  return client("GET", "/v0/events/id/" + request.id);
}
