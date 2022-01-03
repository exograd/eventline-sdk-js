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

import type { PeerCertificate } from "tls";
import type { Id } from "@ev";

import https from "https";
import fs from "fs";
import url from "url";
import tls from "tls";
import crypto from "crypto";

export interface Pagination {
  after?: Id;
  before?: Id;
  size?: number;
  reverse?: boolean;
}

export type Query = Record<string, string | number | boolean>;

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

export const PublicKeyPinSet = ["gg3x7U4UrWfTUpYNy9wL2+GYOQhi3fg5UTn5pzA67gc="];

const defaultOptions: Omit<Options, "projectId"> = {
  host: "api.eventline.net",
  port: 443,
  scheme: "https",
};

const checkServerIdentity = function (host: string, cert: PeerCertificate) {
  const err = tls.checkServerIdentity(host, cert);
  if (err) return err;

  const fingerprint = crypto
    .createHash("sha256")
    .update((cert as any).pubkey)
    .digest("base64");

  if (PublicKeyPinSet.indexOf(fingerprint) === -1) {
    const msg =
      "Certificate verification error: " +
      `The public key of '${cert.subject.CN}' ` +
      "does not match any pinned fingerprints";
    return new Error(msg);
  }
  return;
};

export function makeClient(opts: Options): Client {
  const options = { ...defaultOptions, ...opts };
  const timeout = 30_000;
  const ca = fs.readFileSync(__dirname + "/../data/cacert.pem");
  const accessToken = opts.token ?? process.env["EVCLI_API_KEY"];

  const baseURL = url.format({
    protocol: options.scheme,
    host: options.host,
    port: options.port,
  });

  return function (method: Verb, path: string, body?: string): Promise<any> {
    const httpAgentOptions = {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
        "Content-Length": (body ?? "").length,
        "User-Agent": "eventline-sdk-js",
        "X-Eventline-Project-Id": options.projectId,
      },
      method,
      timeout,
      ca,
      checkServerIdentity,
    };

    const httpOptions = {
      ...httpAgentOptions,
      agent: new https.Agent(httpAgentOptions),
    };

    return new Promise(function (resolve, reject) {
      const request = https.request(
        new URL(path, baseURL),
        httpOptions,
        function (response) {
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
        }
      );
      request.on("error", reject);
      request.on("timeout", request.abort);
      request.write(body ?? "");
      request.end();
    });
  };
}
