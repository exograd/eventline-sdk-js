// Copyright (c) 2021-2022 Exograd SAS.
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

/**
 * Pagination is controlled by cursors. A cursor contains the parameters
 * required the control the selection of elements to be returned and
 * their order.
 */
export interface Pagination {
  /**
   * An opaque key; return elements positioned after the element
   * designated by the key in the defined order (optional).
   */
  after?: Id;

  /**
   * An opaque key; return elements positioned before the element
   * designated by the key in the defined order (optional).
   */
  before?: Id;

  /**
   * The sort to apply to elements (optional, default is id). Different
   * types of elements support different sorts; all elements support the
   * id sort.
   */
  sort?: string;

  /**
   * The number of elements to return, between 0 and 100 (optional,
   * default is 20).
   */
  size?: number;

  /**
   * The order to use for elements, either asc for ascending order or
   * desc for descending order (optional, default is asc).
   */
  order?: string;
}

export type Query = Record<string, string | number | boolean>;

export type Verb = "GET" | "POST" | "PUT" | "DELETE";

/**
 * The response to a paginated query is a page.
 */
export interface ListResponse<T> {
  /**
   * The list of elements contained in the page.
   */
  elements: T[];

  /**
   * The cursor corresponding to the next page if there is one
   * (optional).
   */
  next?: Pagination;

  /**
   * The cursor corresponding to the previous page if there is one
   * (optional).
   */
  previous?: Pagination;
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

export function buildPaginationQuery(q: Query, req: Pagination): void {
  if (req.before !== undefined) q["before"] = req.before;
  if (req.after !== undefined) q["after"] = req.after;
  if (req.sort !== undefined) q["sort"] = req.sort;
  if (req.order !== undefined) q["order"] = req.order;
  if (req.size !== undefined) q["size"] = req.size;
}

export const PublicKeyPinSet = [
  "820df1ed4e14ad67d352960dcbdc0bdbe198390862ddf8395139f9a7303aee07"
];

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
    .digest("hex");

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
  const accessToken = opts.token ?? process.env["EVENTLINE_API_KEY"];

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
        "User-Agent": "Eventline/1.0 (platform; nodejs) eventline-sdk",
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
