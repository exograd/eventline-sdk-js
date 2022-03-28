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
import { buildPaginationQuery } from "./client";

export interface Account {
  /**
   * The identifier of the account.
   */
  id: Id;

  /**
   * The identifier of the organization of the account.
   */
  org_id: Id;

  /**
   * The full name of the user the account belongs to (optional). The
   * name must contain between 1 and 50 characters.
   */
  name: string;

  /**
   * The email address of the account.
   */
  email_address: string;

  /**
   * A flag indicating whether the account is disabled or not (optional,
   * default is false).
   */
  disabled: boolean;

  /**
   * The date the account was created.
   */
  creation_time: string;

  /**
   * The date of the last time someone used this account to authenticate
   * on the Eventline platform (optional).
   */
  last_login_time: string;

  /**
   * The role of the account, either user or admin.
   */
  role: string;

  /**
   * The identifier of the last project selected as current project for
   * this account (optional).
   */
  last_project_id: Id;

  /**
   * An object containing settings used by the account.
   */
  settings: AccountSettings;
}

/**
 * AccountSettings contains account settings.
 */
export interface AccountSettings {
  /**
   * The way dates are formatted on the website, either absolute or
   * relative (optional, default is relative).
   */
  date_format: "relative" | "absolute";
}

export interface ListAccountsRequest extends Pagination {}

export type ListAccountsResponse = ListResponse<Account>;

export async function listAccounts(
  client: Client,
  request: ListAccountsRequest
): Promise<ListAccountsResponse> {
  const q: Query = {};

  buildPaginationQuery(q, request);

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
