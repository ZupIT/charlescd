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

import io.charlescd.moove.domain.GitProviderEnum
import io.charlescd.moove.domain.Metadata

data class DeployRequest(
    val deploymentId: String,
    val authorId: String,
    val callbackUrl: String,
    val namespace: String,
    val components: List<DeployComponentRequest>,
    val git: GitRequest,
    val circle: CircleRequest,
    val metadata: Metadata?
)

data class DeployComponentRequest(
    val componentId: String,
    val componentName: String,
    val helmRepository: String,
    val buildImageUrl: String,
    val buildImageTag: String,
    val hostValue: String?,
    val gatewayName: String?
)

data class CircleRequest(
    val id: String,
    val default: Boolean
)

data class GitRequest(
    val token: String,
    val provider: GitProviderEnum
)
