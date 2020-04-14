/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.request.deployment

import javax.validation.constraints.NotBlank

data class UpdateDeploymentRequest(
    @field:NotBlank
    val buildId: String,

    @field:NotBlank
    val circleId: String
)
