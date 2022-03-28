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

export interface Project {
  /**
   * The identifier of the project.
   */
  id: Id;

  /**
   * The identifier of the organization of the project.
   */
  name: string;

  /**
   * The name of the project.
   */
  org_id: Id;
}

export interface ListProjectsRequest extends Pagination {}

export type ListProjectsResponse = ListResponse<Project>;

export interface GetProjectRequest {
  id: Id;
  by?: "id" | "name";
}

export type GetProjectResponse = Project;

export type CreateProjectRequest = Omit<Project, "id" | "org_id">;

export type CreateProjectResponse = Project;

export interface DeleteProjectRequest {
  id: Id;
}

export interface DeleteProjectResponse {}

export interface UpdateProjectRequest {
  id: Id;
  project: Omit<Project, "id" | "org_id">;
}

export type UpdateProjectResponse = Project;

/**
 * Fetch projects in the organization.
 */
export async function listProjects(
  client: Client,
  request: ListProjectsRequest
): Promise<ListProjectsResponse> {
  const q: Query = {};

  buildPaginationQuery(q, request);

  return client("GET", url.format({ pathname: "/v0/projects", query: q }));
}

/**
 * Fetch a project by identifier.
 */
export async function getProject(
  client: Client,
  request: GetProjectRequest
): Promise<GetProjectResponse> {
  const by = request.by ?? "id";

  return client("GET", "/v0/projects/" + by + "/" + request.id);
}

/**
 * Create a new project.
 */
export async function createProject(
  client: Client,
  request: CreateProjectRequest
): Promise<CreateProjectResponse> {
  const data = JSON.stringify(request);
  return client("POST", "/v0/projects", data);
}

/**
 * Delete a project.
 */
export async function deleteProject(
  client: Client,
  request: DeleteProjectRequest
): Promise<DeleteProjectResponse> {
  return client("DELETE", "/v0/projects/id/" + request.id);
}

/**
 * Update an existing project.
 */
export async function updateProject(
  client: Client,
  request: UpdateProjectRequest
): Promise<UpdateProjectResponse> {
  const data = JSON.stringify(request.project);
  return client("PUT", "/v0/projects/id/" + request.id, data);
}
