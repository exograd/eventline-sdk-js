import { request as httpRequest } from "https";
import url from "url";

import type { Id } from "@ev";

export type Verb = "GET" | "POST" | "PUT" | "DELETE";

export interface ListResponse<T> {
  elements: T[];
  next?: {
    after: Id;
    size: number;
  };
  previous: {
    before: Id;
    size: number;
  };
}

export interface Options {
  host?: string;
  port?: number;
  scheme?: string;
  token?: string;
  projectId: Id;
}

export class RequestError extends Error {
  constructor(
    public status: number | undefined,
    public code: string,
    public data: any,
    msg?: string
  ) {
    super(msg);

    Object.setPrototypeOf(this, RequestError.prototype);
  }
}

export type Client = (verb: Verb, path: string, body?: string) => Promise<any>;

export function makeClient(opts: Options): Client {
  const host: string = opts.host ?? "api.eventline.net";
  const port: number = opts.port ?? 443;
  const scheme: string = opts.scheme ?? "https";
  const token: string = opts.token ?? process.env.EVCLI_API_KEY ?? "";
  const endpoint: URL = new URL(`${scheme}://${host}:${port}`);

  const defaultHeaderFields: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "User-Agent": "eventline-sdk-js",
    "X-Eventline-Project-Id": opts.projectId,
    Authorization: "Bearer " + token,
  };

  return function (
    verb: Verb,
    path: string,
    body?: string
  ): Promise<object | string> {
    const url = new URL(path, endpoint);
    const options = {
      method: verb,
      headers: defaultHeaderFields,
      timeout: 30_000,
    };

    return new Promise(function (resolve, reject) {
      const request = httpRequest(url, options, function (response) {
        let buf = "";

        response.resume();
        response.on("data", (chunk) => (buf += chunk));
        response.on("end", () => {
          let hasSucceeded = true;
          const status = response.statusCode;
          const responseType = response.headers["content-type"];

          if (!response.complete)
            return reject(
              new RequestError(
                status,
                "incomplete_response",
                {},
                "incomplete response"
              )
            );

          if (status === undefined || status < 200 || status >= 300)
            hasSucceeded = false;

          if (responseType === "application/json") {
            try {
              const data = JSON.parse(buf);

              if (hasSucceeded) resolve(data);
              else
                reject(
                  new RequestError(
                    status,
                    data.code ?? "unknown_error",
                    data.data ?? {},
                    data.error
                  )
                );
            } catch {
              reject(
                new RequestError(
                  status,
                  "invalid_json",
                  buf,
                  "invalid json body"
                )
              );
            }
          } else {
            if (hasSucceeded) resolve(buf);
            else reject(new RequestError(status, "unknown_error", buf));
          }
        });
      });
      request.on("error", reject);
      request.on("timeout", request.abort);
      request.end();
    });
  };
}
