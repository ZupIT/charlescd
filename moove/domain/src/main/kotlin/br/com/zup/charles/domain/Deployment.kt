/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.domain

import java.time.LocalDateTime

data class Deployment(
    val id: String,
    val author: User,
    val createdAt: LocalDateTime,
    val deployedAt: LocalDateTime?,
    val status: DeploymentStatusEnum,
    val circle: Circle,
    val buildId: String,
    val applicationId: String
) {
    fun isActive(): Boolean =
        (this.status == DeploymentStatusEnum.DEPLOYED || this.status == DeploymentStatusEnum.DEPLOYING) && !this.circle.isDefault()
}
