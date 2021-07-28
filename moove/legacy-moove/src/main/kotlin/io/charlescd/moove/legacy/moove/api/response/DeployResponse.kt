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

package io.charlescd.moove.legacy.moove.api.response

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
    val status: String,
    val createdAt: LocalDateTime
)

data class DeployCircleResponse(
    val headerValue: String,
    val removeCircle: Boolean? = null
)
