/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.commons.representation

data class CredentialRepresentation(
    val credentialId: CredentialIdRepresentation,
    val value: Map<String, Any?>
)

data class CredentialIdRepresentation(
    val organization: String,
    val service: String,
    val id: String
)