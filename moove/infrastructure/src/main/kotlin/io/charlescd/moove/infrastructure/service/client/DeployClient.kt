/*
 * Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

package io.charlescd.moove.infrastructure.service.client

import io.charlescd.moove.infrastructure.configuration.ButlerEncoderConfiguration
import io.charlescd.moove.infrastructure.service.client.request.DeployRequest
import io.charlescd.moove.infrastructure.service.client.request.UndeployRequest
import io.charlescd.moove.infrastructure.service.client.response.*
import java.net.URI
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*

// TODO remove url. It is currently needed here because we couldn't find another way to disable Ribbon (https://github.com/Netflix/ribbon).
@FeignClient(name = "deployClient", url = "\${charlescd.deploy.url}", configuration = [ ButlerEncoderConfiguration::class])
interface DeployClient {
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(
        value = ["/v2/deployments"],
        produces = [MediaType.APPLICATION_JSON_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun deploy(url: URI, @RequestBody request: DeployRequest): DeployResponse

    @ResponseStatus(HttpStatus.OK)
    @PostMapping(
        value = ["/v2/deployments/{deploymentId}/undeploy"],
        produces = [MediaType.APPLICATION_JSON_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun undeploy(url: URI, @PathVariable("deploymentId") deploymentId: String, @RequestBody request: UndeployRequest): UndeployResponse

    @ResponseStatus(HttpStatus.OK)
    @GetMapping(
        value = ["/configurations/cd"],
        produces = [MediaType.APPLICATION_JSON_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun getCdConfigurations(
        @RequestHeader("x-workspace-id") workspaceId: String
    ): List<GetDeployCdConfigurationsResponse>

    @ResponseStatus(HttpStatus.OK)
    @GetMapping(
        value = ["/v2/deployments/{deploymentId}/logs"],
        produces = [MediaType.APPLICATION_JSON_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun getDeploymentLogs(
        url: URI,
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable("deploymentId") deploymentId: String
    ): LogResponse

    @ResponseStatus(HttpStatus.OK)
    @GetMapping(
        value = ["/healthcheck"],
        consumes = [MediaType.APPLICATION_JSON_VALUE],
        produces = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun healthCheck(url: URI): HealthCheckResponse
}
