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
import type { Client, ListResponse } from "@ev/client";

import url from "url";

export interface Project {
  id: Id;
  name: string;
  org_id: Id;
}

export interface ListProjectsRequest {
  after?: Id;
  size?: number;
}

export type ListProjectsResponse = ListResponse<Project>;

export async function listProjects(
  client: Client,
  request: ListProjectsRequest
): Promise<ListProjectsResponse> {
  const query: Record<string, string> = {};

  if (request.after !== undefined) query["after"] = request.after;
  if (request.size !== undefined) query["size"] = request.size.toString();

  return client("GET", url.format({ pathname: "/v0/projects", query: query }));
}

export interface GetProjectRequest {
  id: Id;
  by?: "id" | "name";
}

export type GetProjectResponse = Project;

export async function getProject(
  client: Client,
  request: GetProjectRequest
): Promise<GetProjectResponse> {
  const by = request.by ?? "id";

  return client("GET", "/v0/projects/" + by + "/" + request.id);
}

export type CreateProjectRequest = Omit<Project, "id" | "org_id">;

export type CreateProjectResponse = Project;

export async function createProject(
  client: Client,
  request: CreateProjectRequest
): Promise<CreateProjectResponse> {
  const data = JSON.stringify(request);
  return client("POST", "/v0/projects", data);
}

export interface DeleteProjectRequest {
  id: Id;
}

export interface DeleteProjectResponse {}

export async function deleteProject(
  client: Client,
  request: DeleteProjectRequest
): Promise<DeleteProjectResponse> {
  return client("DELETE", "/v0/projects/id/" + request.id);
}

export interface UpdateProjectRequest {
  id: Id;
  project: Omit<Project, "id" | "org_id">;
}

export type UpdateProjectResponse = Project;

export async function updateProject(
  client: Client,
  request: UpdateProjectRequest
): Promise<UpdateProjectResponse> {
  const data = JSON.stringify(request.project);
  return client("PUT", "/v0/projects/id/" + request.id, data);
}
