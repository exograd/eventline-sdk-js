export type Id = string;
export type MaybeId = Id | undefined;
export type MaybeString = string | undefined;

export function isExecutedInEventline(): boolean {
    return process.env.EVENTLINE === "true";
}

export function getCurrentProjectId(): MaybeId {
    return process.env.EVENTLINE_PROJECT_ID;
}

export function getCurrentProjectName(): MaybeString {
    return process.env.EVENTLINE_PROJECT_NAME;
}

export function getCurrentPipelineId(): MaybeId {
    return process.env.EVENTLINE_PIPELINE_ID;
}

export function getCurrentTaskId(): MaybeId {
    return process.env.EVENTLINE_TASK_ID;
}
