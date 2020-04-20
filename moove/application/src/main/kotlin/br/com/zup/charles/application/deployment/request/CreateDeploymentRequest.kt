/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.application.deployment.request

import br.com.zup.charles.domain.Circle
import br.com.zup.charles.domain.Deployment
import br.com.zup.charles.domain.DeploymentStatusEnum
import br.com.zup.charles.domain.User
import java.time.LocalDateTime
import java.util.*
import javax.validation.constraints.NotBlank

data class CreateDeploymentRequest(
    @field:NotBlank
    val authorId: String,

    @field:NotBlank
    val circleId: String,

    @field:NotBlank
    val buildId: String
) {
    fun toDeployment(applicationId: String, user: User, circle: Circle): Deployment {
        return Deployment(
            id = UUID.randomUUID().toString(),
            author = user,
            createdAt = LocalDateTime.now(),
            deployedAt = null,
            circle = circle,
            status = DeploymentStatusEnum.DEPLOYING,
            applicationId = applicationId,
            buildId = buildId
        )
    }
}