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
import type { Event } from "@ev/event";

import { readFile } from "fs";

export interface Context {
  /**
   * The event associated with the current pipeline.
   */
  readonly event: Readonly<Event>;

  /**
   * The set of parameters passed to the task in the pipeline resource
   * definition, associating the name of the parameter to its value.
   */
  readonly task_parameters: Object;

  /**
   * When the task has multiple instances, the identifier of the
   * instance, from 1 to the number of instances. If the task has a
   * single instance, the identifier is set to 1.
   */
  readonly instance_id: Id;

  /**
   * The set of identities which were listed in the task resource,
   * associating the name of the identity to an object describing it.
   */
  readonly identities: Object;
}

/**
 * Load and decode Eventline context file.
 */
export function loadContext(): Promise<Context> {
  return new Promise(function (resolve, reject) {
    readFile("/eventline/task/context", function (err, file): void {
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

/**
 * Returns `true` when the pipeline is launch by a command.
 */
export function isLaunchByCommand(ctx: Context): boolean {
  return ctx.event.trigger_id === undefined;
}

/**
 * Returns `true` when the pipeline is launch by an event.
 */
export function isLaunchByEvent(ctx: Context): boolean {
  return ctx.event.command_id === undefined;
}
