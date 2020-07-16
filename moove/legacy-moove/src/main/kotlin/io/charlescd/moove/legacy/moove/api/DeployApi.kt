/*
 *
 *  * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *
 */

package io.charlescd.moove.legacy.moove.api

import io.charlescd.moove.legacy.moove.api.request.CreateDeployCdConfigurationRequest
import io.charlescd.moove.legacy.moove.api.request.CreateDeployModuleRequest
import io.charlescd.moove.legacy.moove.api.request.UndeployRequest
import io.charlescd.moove.legacy.moove.api.response.CreateDeployCdConfigurationResponse
import io.charlescd.moove.legacy.moove.api.response.CreateDeployModuleResponse
import io.charlescd.moove.legacy.moove.api.response.GetDeployCdConfigurationsResponse
import io.charlescd.moove.legacy.moove.api.response.UndeployResponse
import javax.validation.Valid
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*

@FeignClient(name = "deployApi", url = "\${charlescd.deploy.url}")
interface DeployApi {

    @ResponseStatus(HttpStatus.OK)
    @PostMapping(
        value = ["/undeployments"],
        produces = [MediaType.APPLICATION_JSON_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun undeploy(@Valid @RequestBody request: UndeployRequest): UndeployResponse

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(
        value = ["/configurations/cd"],
        produces = [MediaType.APPLICATION_JSON_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun createCdConfiguration(
        @Valid @RequestBody request: CreateDeployCdConfigurationRequest,
        @RequestHeader("x-workspace-id") workspaceId: String
    ): CreateDeployCdConfigurationResponse

    @ResponseStatus(HttpStatus.OK)
    @GetMapping(
        value = ["/configurations/cd"],
        produces = [MediaType.APPLICATION_JSON_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun getCdConfigurations(
        @RequestHeader("x-workspace-id") workspaceId: String
    ): List<GetDeployCdConfigurationsResponse>

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(
        value = ["/modules"],
        produces = [MediaType.APPLICATION_JSON_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun createModule(
        @Valid @RequestBody request: CreateDeployModuleRequest
    ): CreateDeployModuleResponse

    @ResponseStatus(HttpStatus.OK)
    @DeleteMapping(
        value = ["/configurations/cd/{id}"]
    )
    fun deleteCdConfiguration(
        @PathVariable("id") id: String,
        @RequestHeader("x-workspace-id") workspaceId: String
    )
}
