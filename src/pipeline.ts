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

/**
 * Pipelines are used to define graphs of tasks which are executed as a
 * single unit. Once a pipeline is defined, it can be instantiated
 * either when a trigger is activated or when a command is called.
 */
export interface Pipeline {
  /**
   * The identifier of the pipeline.
   */
  id: Id;

  /**
   * The identifier of the event associated with the pipeline.
   */
  event_id: Id;

  /**
   * The date of the event associated with the pipeline.
   */
  event_time: string;

  /**
   * The identifier of the organization of the pipeline.
   */
  org_id: Id;

  /**
   * The identifier of the project of the pipeline.
   */
  project_id: Id;

  /**
   * The identifier of the trigger at the origin of the event
   *(optional). Only present if the pipeline was created following the
   *activation of a trigger.
   */
  trigger_id?: Id;

  /**
   * The identifier of the command at the origin of the event
   * (optional). Only present if the pipeline was created following the
   * execution of a command.
   */
  command_id?: Id;

  /**
   * The identifier of the pipeline resource (optional). The field will
   * not be present if the resource was deleted after the pipeline was
   * created.
   */
  pipeline_id?: Id;

  /**
   * The identifier of the pipeline.
   */
  name: string;

  /**
   * A flag indicating whether the pipeline can be executed concurrently
   * with other pipelines based on the same pipeline resource (optional,
   * default is false).
   */
  concurrent: boolean;

  /**
   * The date the pipeline was created.
   */
  creation_time: string;

  /**
   * The date the first task in the pipeline started (optional).
   */
  start_time: string;

  /**
   * The date the last task in the pipeline finished (optional).
   */
  end_time: string;

  /**
   * The current status of the pipeline, either created, started,
   * aborted, successful or failed. See the pipeline execution
   * documentation for more information.
   */
  status: "created" | "started" | "aborted" | "successful" | "failed";
}

export interface ListPipelinesRequest extends Pagination {}

export type ListPipelinesResponse = ListResponse<Pipeline>;

export interface GetPipelineRequest {
  id: Id;
}

export type GetPipelineResponse = Pipeline;

export interface RestartPipelineRequest {
  id: Id;
}

export interface RestartPipelineResponse {}

export interface RestartPipelineFromFailureRequest {
  id: Id;
}

export interface RestartPipelineFromFailureResponse {}

export interface AbortPipelineRequest {
  id: Id;
}

export interface AbortPipelineResponse {}

export interface GetScratchpadRequest {
  id: Id;
}

export type GetScratchpadResponse = Record<string, string>;

export interface DeleteScratchpadRequest {
  id: Id;
}

export interface DeleteScratchpadResponse {}

export interface GetScratchpadKeyRequest {
  id: Id;
  key: string;
}

export type GetScratchpadKeyResponse = string;

export interface PutScratchpadKeyRequest {
  id: Id;
  key: string;
  value: string;
}

export interface PutScratchpadKeyResponse {}

export interface DeleteScratchpadKeyRequest {
  id: Id;
  key: string;
}

export interface DeleteScratchpadKeyResponse {}

/**
 * Fetch pipelines in the project.
 */
export async function listPipelines(
  client: Client,
  request: ListPipelinesRequest
): Promise<ListPipelinesResponse> {
  const q: Query = {};

  buildPaginationQuery(q, request);

  return client("GET", url.format({ pathname: "/v0/pipelines", query: q }));
}

/**
 * Fetch a pipeline by identifier.
 */
export async function getPipeline(
  client: Client,
  request: GetPipelineRequest
): Promise<GetPipelineResponse> {
  return client("GET", "/v0/pipelines/id/" + request.id);
}

/**
 * Restart a finished pipeline.
 */
export async function restartPipeline(
  client: Client,
  request: RestartPipelineRequest
): Promise<RestartPipelineResponse> {
  return client("POST", "/v0/pipelines/id/" + request.id + "/restart");
}

/**
 * Restart the failed tasks in a finished pipeline.
 */
export async function restartPipelineFromFailure(
  client: Client,
  request: RestartPipelineFromFailureRequest
): Promise<RestartPipelineFromFailureResponse> {
  return client(
    "POST",
    "/v0/pipelines/id/" + request.id + "/restart_from_failure"
  );
}

/**
 * Abort a pipeline.
 */
export async function abortPipeline(
  client: Client,
  request: AbortPipelineRequest
): Promise<AbortPipelineResponse> {
  return client("POST", "/v0/pipelines/id/" + request.id + "/abort");
}

/**
 * Fetch all entries in a scratchpad.
 */
export async function getScratchpad(
  client: Client,
  request: GetScratchpadRequest
): Promise<GetScratchpadResponse> {
  return client("GET", "/v0/pipelines/id/" + request.id + "/scratchpad");
}

/**
 * Delete all entries in a scratchpad.
 */
export async function deleteScratchpad(
  client: Client,
  request: DeleteScratchpadRequest
): Promise<DeleteScratchpadResponse> {
  return client("DELETE", "/v0/pipelines/id/" + request.id + "/scratchpad");
}

/**
 * Fetch an entry in a scratchpad.
 */
export async function getScratchpadKey(
  client: Client,
  request: GetScratchpadKeyRequest
): Promise<GetScratchpadKeyResponse> {
  return client(
    "GET",
    "/v0/pipelines/id/" + request.id + "/scratchpad/key/" + request.key
  );
}

/**
 * Set the value of an entry in a scratchpad.
 */
export async function putScratchpadKey(
  client: Client,
  request: PutScratchpadKeyRequest
): Promise<PutScratchpadKeyResponse> {
  return client(
    "PUT",
    "/v0/pipelines/id/" + request.id + "/scratchpad/key/" + request.key,
    request.value
  );
}

/**
 * Delete an entry in a scratchpad.
 */
export async function deleteScratchpadKey(
  client: Client,
  request: DeleteScratchpadKeyRequest
): Promise<DeleteScratchpadKeyResponse> {
  return client(
    "DELETE",
    "/v0/pipelines/id/" + request.id + "/scratchpad/key/" + request.key
  );
}
