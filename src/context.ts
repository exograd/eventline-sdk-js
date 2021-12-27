import type { Id } from "@ev/index";
import type { Event } from "@ev/event";

import { readFile } from 'fs';

export interface Context {
    readonly event: Readonly<Event>;
    readonly task_parameters: Object;
    readonly instance_id: Id;
    readonly identities: Object;
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

export function isLaunchByCommand(ctx: Context): boolean {
    return ctx.event.trigger_id === undefined;
}

export function isLaunchByEvent(ctx: Context): boolean {
    return ctx.event.command_id === undefined;
}
