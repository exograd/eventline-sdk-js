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

export interface Pipeline {
  id: Id;
  event_id: Id;
  org_id: Id;
  project_id: Id;
  trigger_id: Id;
  name: string;
  concurrent: boolean;
  creation_time: string;
  start_time: string;
  end_time: string;
  status: "created" | "started" | "aborted" | "successful" | "failed";
}

export interface ListPipelinesRequest extends Pagination {}

export type ListPipelinesResponse = ListResponse<Pipeline>;

export async function listPipelines(
  client: Client,
  request: ListPipelinesRequest
): Promise<ListPipelinesResponse> {
  const q: Query = {};

  buildPaginationQuery(q, request);

  return client("GET", url.format({ pathname: "/v0/pipelines", query: q }));
}

export interface GetPipelineRequest {
  id: Id;
}

export type GetPipelineResponse = Pipeline;

export async function getPipeline(
  client: Client,
  request: GetPipelineRequest
): Promise<GetPipelineResponse> {
  return client("GET", "/v0/pipelines/id/" + request.id);
}
