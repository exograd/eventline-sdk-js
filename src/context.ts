import type { Id } from "./index.js";

import { readFile } from 'fs';

export interface Context {
    readonly event: Event;
    readonly task_parameters: Object;
    readonly instance_id: Id;
    readonly identities: Object;
}

export interface Event {
    readonly id: Id;
    readonly org_id: Id;
    readonly trigger_id?: Id;
    readonly command_id?: Id;
    readonly creation_time: string;
    readonly event_time: string;
    readonly name: string;
    readonly data: Object;
}

export function loadContext(): Promise<Context> {
    return new Promise(function(resolve, reject) {
        readFile("/eventline/task/context", function(err, file): void {
            if (err) reject(err);
            else {
                try {
                    resolve(JSON.parse(file.toString()));
                } catch (err) {
                    reject(err);
                }
            }
        });
    });
}

export function isLaunchByCommand(context: Context): boolean {
    return context.event.trigger_id === undefined;
}

export function isLaunchByEvent(context: Context): boolean {
    return context.event.command_id === undefined;
}

