/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.infrastructure.service.client

data class DeployRequest(
    val deploymentId: String,
    val applicationName: String,
    val modules: List<DeployModuleRequest>,
    val authorId: String,
    val description: String,
    val circle: DeployCircleRequest? = null,
    val callbackUrl: String
)

data class DeployModuleRequest(
    val moduleId: String,
    val helmRepository: String,
    val components: List<DeployComponentRequest>
)

data class DeployComponentRequest(
    val componentId: String,
    val componentName: String,
    val buildImageUrl: String,
    val buildImageTag: String,
    val contextPath: String?,
    val healthCheck: String?,
    val port: Int?
)

data class DeployCircleRequest(
    val headerValue: String,
    val removeCircle: Boolean? = null
)