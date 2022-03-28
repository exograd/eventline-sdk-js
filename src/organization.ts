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
import type { Client } from "@ev/client";

export interface Organization {
  /**
   * The identifier of the organization.
   */
  id: Id;

  /**
   * The name of the organization.
   */
  name: string;

  /**
   * The registered address of the organization.
   */
  address: string;

  /**
   * The postal code of the registered address of the organization.
   */
  postal_code: string;

  /**
   * The city of the registered address of the organization.
   */
  city: string;

  /**
   * The country of the registered address of the organization.
   */
  country: string;

  /**
   * The email address used as primary contact by the organization.
   */
  contact_email_address: string;

  /**
   * A flag indicating whether the organization accepts to receive
   * non-essential emails from Exograd or not (optional, default is
   * false). See our privacy policy for more information.
   */
  non_essential_mail_opt_in: boolean;

  /**
   * The VAT identification number (optional).
   */
  vat_id_number?: string;
}

export interface GetOrganizationRequest {}

export type GetOrganizationResponse = Organization;

/**
 * Fetch the organization associated with the credentials currently used
 * by the client.
 */
export async function getOrganization(
  client: Client,
  _request: GetOrganizationRequest
): Promise<GetOrganizationResponse> {
  return client("GET", "/v0/org");
}
