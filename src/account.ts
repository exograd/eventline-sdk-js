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
import type { Client, Pagination, Query, ListResponse } from "@ev/client";

import url from "url";

export interface Account {
  id: Id;
  org_id: Id;
  name: string;
  email_address: string;
  disabled: boolean;
  creation_time: string;
  last_login_time: string;
  role: string;
  last_project_id: Id;
  settings: AccountSettings;
}

export interface AccountSettings {
  date_format: "relative" | "absolute";
}

export interface ListAccountsRequest extends Pagination {}

export type ListAccountsResponse = ListResponse<Account>;

export async function listAccounts(
  client: Client,
  request: ListAccountsRequest
): Promise<ListAccountsResponse> {
  const q: Query = {};

  if (request.before !== undefined) q["before"] = request.before;
  if (request.after !== undefined) q["after"] = request.after;
  if (request.reverse !== undefined) q["reverse"] = request.reverse;
  if (request.size !== undefined) q["size"] = request.size;

  return client("GET", url.format({ pathname: "/v0/accounts", query: q }));
}

export interface GetAccountRequest {
  id: Id;
}

export type GetAccountResponse = Account;

export async function getAccount(
  client: Client,
  request: GetAccountRequest
): Promise<GetAccountResponse> {
  return client("GET", "/v0/accounts/id/" + request.id);
}

export interface GetCurrentAccountRequest {}

export type GetCurrentAccountResponse = Account;

export async function getCurrentAccount(
  client: Client,
  _request: GetCurrentAccountRequest
): Promise<GetCurrentAccountResponse> {
  return client("GET", "/v0/account");
}
