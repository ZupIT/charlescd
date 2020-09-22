/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.charlescd.moove.infrastructure.service.client.request

data class DeployRequest(
    val deploymentId: String,
    val applicationName: String,
    val modules: List<DeployModuleRequest>,
    val authorId: String,
    val description: String,
    val circle: DeployCircleRequest? = null,
    val callbackUrl: String,
    val cdConfigurationId: String
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
    val hostValue: String?,
    val gatewayName: String?
)

data class DeployCircleRequest(
    val headerValue: String,
    val removeCircle: Boolean? = null
)
