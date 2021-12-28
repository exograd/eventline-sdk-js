import type { Id } from "@ev/index.js";

export interface Event {
  id: Id;
  org_id: Id;
  trigger_id?: Id;
  command_id?: Id;
  creation_time: string;
  event_time: string;
  name: string;
  data: Object;
}
