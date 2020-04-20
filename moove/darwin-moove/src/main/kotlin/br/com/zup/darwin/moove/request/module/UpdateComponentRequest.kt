/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.request.module

import javax.validation.constraints.NotBlank

data class UpdateComponentRequest(
    @field:NotBlank
    val id: String,

    @field:NotBlank
    val name: String,

    val contextPath: String?,

    val port: Int?,

    val healthCheck: String?
)