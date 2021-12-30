export type Id = string;
export type Maybe<T> = T | undefined;

/**
 * Returns `true` when the function is called in an Eventline instance.
 */
export function isExecutedInEventline(): boolean {
  return process.env.EVENTLINE === "true";
}

/**
  * Returns the current project id when the function is called in an
  * Eventline instance.
 */
export function getCurrentProjectId(): Maybe<Id> {
  return process.env.EVENTLINE_PROJECT_ID;
}

/**
 * Returns the current project name when the function is called in an
 * Eventline instance.
 */
export function getCurrentProjectName(): Maybe<string> {
  return process.env.EVENTLINE_PROJECT_NAME;
}

/**
 * Returns the current pipeline id when the function is called in an
 * Eventline instance.
 */
export function getCurrentPipelineId(): Maybe<Id> {
  return process.env.EVENTLINE_PIPELINE_ID;
}

/**
 * Returns the current task id when the function is called in an
 * Eventline instance.
 */
export function getCurrentTaskId(): Maybe<Id> {
  return process.env.EVENTLINE_TASK_ID;
}
