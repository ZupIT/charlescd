/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.api.response

import java.time.LocalDateTime

data class DeployResponse(
    val id: String,
    val modulesDeployments: List<DeployModuleResponse>,
    val callbackUrl: String,
    val applicationName: String,
    val circle: DeployCircleResponse?,
    val defaultCircle: Boolean,
    val authorId: String,
    val status: String,
    val createdAt: LocalDateTime
)

data class DeployModuleResponse(
    val id: String,
    val moduleId: String,
    val componentsDeployments: List<DeployComponentResponse>,
    val status: String,
    val createdAt: LocalDateTime
)

data class DeployComponentResponse(
    val id: String,
    val componentId: String,
    val componentName: String,
    val buildImageUrl: String,
    val buildImageTag: String,
    val contextPath: String?,
    val healthCheck: String?,
    val port: Int?,
    val status: String,
    val createdAt: LocalDateTime
)

data class DeployCircleResponse(
    val headerValue: String,
    val removeCircle: Boolean? = null
)
