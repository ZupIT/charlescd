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

data class CreateDeployModuleResponse(

    val id: String,

    val cdConfigurationId: String,

    val createdAt: LocalDateTime,

    val components: List<CreateDeployComponentResponse>
)

data class CreateDeployComponentResponse(

    val id: String,

    val pipelineOptions: CreateDeployComponentPipelineResponse,

    val createdAt: LocalDateTime
)

data class CreateDeployComponentPipelineResponse(

    val pipelineCircles: List<CreateDeployComponentPipelineCircles>,

    val pipelineVersions: List<CreateDeployComponentPipelineVersions>,

    val pipelineUnusedVersions: List<CreateDeployComponentPipelineVersions>
)

data class CreateDeployComponentPipelineCircles(

    val header: CreateDeployComponentPipelineCircleHeader,

    val destination: CreateDeployComponentPipelineDestination
)

data class CreateDeployComponentPipelineCircleHeader(

    val headerName: String,

    val headerValue: String
)

data class CreateDeployComponentPipelineDestination(

    val version: String
)

data class CreateDeployComponentPipelineVersions(

    val versionUrl: String,

    val version: String
)
