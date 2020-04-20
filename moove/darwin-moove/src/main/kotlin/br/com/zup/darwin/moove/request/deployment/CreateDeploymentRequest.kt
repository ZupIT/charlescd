/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.request.deployment

import javax.validation.constraints.NotBlank

data class CreateDeploymentRequest(
    @field:NotBlank
    val authorId: String,

    @field:NotBlank
    val circleId: String,

    @field:NotBlank
    val buildId: String
)
