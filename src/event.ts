// Copyright (c) 2021-2022 Exograd SAS.
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

export interface Event {
  /**
   * The identifier of the event.
   */
  id: Id;

  /**
   * The identifier of the organization the event is part of.
   */
  org_id: Id;

  /**
   * The identifier of the trigger at the origin of the event
   * (optional). Only present if the event was created following the
   * activation of a trigger.
   */
  trigger_id?: Id;

  /**
   * The identifier of the command at the origin of the event
   * (optional). Only present if the event was created following the
   * execution of a command.
   */
  command_id?: Id;

  /**
   * The date the event was created.
   */
  creation_time: string;

  /**
   * The date the event actually happened.
   */
  event_time: string;

  /**
   * The name of the connector.
   */
  name: string;

  /**
   * The name of the event.
   */
  data: Object;

  /**
   * The set of data contained by the event. Depends on the connector
   * and name. See the documentation of the event on the connector page
   * for more information.
   */
  original_event_id?: Id;
}

export interface ListEventsRequest extends Pagination {
  pipelineId?: Id;
  connector?: string;
  name?: string;
}

export type ListEventsResponse = ListResponse<Event>;

export interface GetEventRequest {
  id: Id;
}

export type GetEventResponse = Event;

export interface CreateEventRequest {
  eventTime?: Date | string;
  connector: string;
  name: string;
  data: object;
}

export type CreateEventResponse = Event[];

export interface ReplayEventRequest {
  id: Id;
}

export type ReplayEventResponse = Event;

/**
 * Fetch a list of events.
 */
export async function listEvents(
  client: Client,
  request: ListEventsRequest
): Promise<ListEventsResponse> {
  const q: Query = {};

  buildPaginationQuery(q, request);
  if (request.pipelineId !== undefined) q["pipeline_id"] = request.pipelineId;
  if (request.connector !== undefined) q["connector"] = request.connector;
  if (request.name !== undefined) q["name"] = request.name;

  return client("GET", url.format({ pathname: "/v0/events", query: q }));
}

/**
 * Fetch an event by identifier.
 */
export async function getEvent(
  client: Client,
  request: GetEventRequest
): Promise<GetEventResponse> {
  return client("GET", "/v0/events/id/" + request.id);
}

/**
 * Create a new custom event.
 */
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

/**
 * Replay an existing event.
 */
export async function replayEvent(
  client: Client,
  request: ReplayEventRequest
): Promise<ReplayEventResponse> {
  return client("POST", "/v0/events/id/" + request.id + "/replay");
}
