export type Id = string;
export type MaybeId = Id | undefined;

export function isExecutedInEventline(): boolean {
    return process.env.EVENTLINE === "true";
}

export function getCurrentProjectId(): MaybeId {
    return process.env.EVENTLINE_PROJECT_ID;
}

