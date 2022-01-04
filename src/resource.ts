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

export interface Resource<T> {
  /**
   * The resource id.
   */

  id: Id;
  /**
   * The organization id.
   */
  org_id: Id;

  /**
   * The project id.
   */
  project_id: Id;

  /**
   * State of the resource.
   */
  disabled: boolean;

  /**
   * The resource creation datetime.
   */
  creation_time: string;

  /**
   * The resource update datetime.
   */
  update_time: string;

  /**
   * The resource definition.
   */
  spec: ResourceSpec<T>;
}

export type ResourceType = "command" | "pipeline" | "task" | "trigger";

export interface ResourceSpec<T> {
  /**
   * A valid resource type: trigger, command, pipeline or task.
   */
  type: ResourceType;

  /**
   * The version associated with the resource type.
   */
  version: 1;

  /**
   * The name of the resource.
   */
  name: string;

  /**
   * A short description of the resource.
   */
  description?: string;

  /**
   * Data specific to the resource type.
   */
  data: T;
}

export interface Command {
  /**
   * The set of parameters used by the command.
   */
  parameters: Parameter[];

  /**
   * A list of pipelines to instantiate when the command is executed.
   */
  pipelines: string[];
}

export interface Parameter {
  /**
   * The name of the parameter. It must be unique in each command.
   */
  name: string;

  /**
   * The data type of the parameter.
   */
  type: "string" | "number" | "boolean";

  /**
   * A list of valid values for the parameter. Can only be used for
   * parameters of type string.
   */
  values?: string[];

  /**
   * The value used for the parameter if it is not provided during
   * command execution. The parameter is mandatory if it does not have a
   * default value.
   */
  default?: string;

  /**
   * A description of the parameter.
   */
  description?: string;

  /**
   * If defined, set an environment variable to the value of this
   * parameter in all pipelines instantiated from this command.
   */
  environment?: string;
}

export interface Pipeline {
  /**
   * True if multiple instances of the pipelines can be executed at the
   * same time, or false else
   */
  concurrent?: boolean;

  /**
   * The set of tasks which are part of the pipeline.
   */
  tasks: PipelineTask[];
}

export interface PipelineTask {
  /**
   * The name of the task in this pipeline.
   */
  name?: string;

  /**
   * A description of the task.
   */
  label?: string;

  /**
   * The name of the task resource.
   */
  task: string;

  /**
   * The set of parameters used for the task
   */
  parameters?: object;

  /**
   * The list of names of the tasks which must be executed before this
   * one in the pipeline.
   */
  dependencies?: string[];

  /**
   * The behavior of the pipeline if the task does not succeed.
   */
  on_failure?: "abort" | "continue";

  /**
   * The number of times to instantiate the task in the pipeline.
   */
  nb_instances?: number;

  /**
   * The number of times to retry a task if it fails.
   */
  nb_retries?: number;

  /**
   * The number of seconds to wait before scheduling a task during a
   * retry.
   */
  retry_delay?: number;
}

export interface Task {
  /**
   * The configuration of the runtime used to execute the task.
   */
  runtime: TaskRuntime;

  /**
   * The list of steps to execute.
   */
  steps: TaskStep[];

  /**
   * The set of environment variables defined during execution.
   */
  environment?: Record<string, string>;

  /**
   * The list of identities to be made available to the task during
   * execution.
   */
  identities?: string[];

  /**
   * The set of parameters used by the command.
   */
  parameters?: Parameter[];
}

export interface TaskRuntime {
  /**
   * The identifier of the runtime.
   */
  name: "container";

  /**
   * The set of parameters for the runtime.
   */
  parameters: {
    /**
     * The name and tag of the image.
     */
    image: string;

    /**
     * The type of the machine used to execute the main container.
     */
    host_type?: "small" | "medium" | "large";

    /**
     * The list of identities which will be used to fetch private
     * container images on external image registries.
     */
    registry_identities?: string[];

    /**
     * A list of up-to 5 containers to be run along the main one.
     */
    extra_containers?: {
      /**
       * The name of the container.
       */
      name: string;

      /**
       * The name and tag of the image.
       */
      image: string;

      /**
       * The command executed for this container.
       */
      command?: string;

      /**
       * The arguments of the command executed for this container.
       */
      arguments?: string[];

      /**
       * The set of environment variables defined during execution.
       */
      environment: Record<string, string>;
    }[];
  };
}

export interface TaskStep {
  /**
   * A text label used on the interface to identify the step.
   */
  label?: string;

  /**
   * The command to be executed. It must not contain any space character.
   */
  command?: string;

  /**
   * The inlined source code to run.
   */
  code?: string;

  /**
   * A path to a source file to run.
   */
  source?: string;

  /**
   * The arguments passed to the command or code fragment during
   * execution.
   */
  arguments?: string;
}

export interface Trigger {
  /**
   * The name of the connector associated with the trigger.
   */
  connector: string;

  /**
   * The name of the event the trigger reacts to.
   */
  event: string;

  /**
   * The name of the identity used to authenticate against the external
   * service.
   */
  identity?: string;

  /**
   * Subscription parameters for the connector and event.
   */
  parameters?: object;

  /**
   * A list of pipelines to instantiate when the trigger is activated.
   */
  pipelines: string[];
}

export interface ListResourcesRequest extends Pagination {
  type?: ResourceType;
}

export type ListResourcesResponse<T> = ListResponse<Resource<T>>;

export async function listResources<T>(
  client: Client,
  request: ListResourcesRequest
): Promise<ListResourcesResponse<T>> {
  const q: Query = {};

  buildPaginationQuery(q, request);

  if (request.type !== undefined) q["type"] = request.type;

  return client("GET", url.format({ pathname: "/v0/resources", query: q }));
}

export interface GetResourceRequest {
  id: Id;
}

export type GetResourceResponse<T> = Resource<T>;

export async function getResource<T>(
  client: Client,
  request: GetResourceRequest
): Promise<GetResourceResponse<T>> {
  return client(
    "GET",
    url.format({ pathname: "/v0/resources/id/" + request.id })
  );
}
