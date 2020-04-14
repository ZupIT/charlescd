/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.api.response

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
