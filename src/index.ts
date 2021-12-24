export type Id = string;

export function isExecutedInEventline(): boolean {
    return process.env.EVENTLINE === "true";
}

