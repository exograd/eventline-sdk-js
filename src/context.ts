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
