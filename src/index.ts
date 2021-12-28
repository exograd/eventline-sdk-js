export type Id = string;
export type Maybe<T> = T | undefined;

export function isExecutedInEventline(): boolean {
  return process.env.EVENTLINE === "true";
}

export function getCurrentProjectId(): Maybe<Id> {
  return process.env.EVENTLINE_PROJECT_ID;
}

export function getCurrentProjectName(): Maybe<string> {
  return process.env.EVENTLINE_PROJECT_NAME;
}

export function getCurrentPipelineId(): Maybe<Id> {
  return process.env.EVENTLINE_PIPELINE_ID;
}

export function getCurrentTaskId(): Maybe<Id> {
  return process.env.EVENTLINE_TASK_ID;
}
