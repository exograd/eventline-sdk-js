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
import type { Client, Query, ListResponse } from "@ev/client";

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
  before?: Id;
  size?: number;
  reverse?: boolean;
  pipelineId?: Id;
  connector?: string;
  name?: string;
}

export type ListEventsResponse = ListResponse<Event>;

export async function listEvents(
  client: Client,
  request: ListEventsRequest
): Promise<ListEventsResponse> {
  const q: Query = {};

  if (request.before !== undefined) q["before"] = request.before;
  if (request.after !== undefined) q["after"] = request.after;
  if (request.reverse !== undefined) q["reverse"] = request.reverse;
  if (request.size !== undefined) q["size"] = request.size;
  if (request.pipelineId !== undefined) q["pipeline_id"] = request.pipelineId;
  if (request.connector !== undefined) q["connector"] = request.connector;
  if (request.name !== undefined) q["name"] = request.name;

  return client("GET", url.format({ pathname: "/v0/events", query: q }));
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

export interface CreateEventRequest {
  eventTime?: Date | string;
  connector: string;
  name: string;
  data: object;
}

export type CreateEventResponse = Event;

export async function createEvent(
  client: Client,
  request: CreateEventRequest
): Promise<CreateEventResponse> {
  const data = JSON.stringify({
    event_time: request.eventTime ?? new Date(),
    connector: request.connector,
    name: request.name,
    data: request.data,
  });

  return client("POST", "/v0/events", data);
}
