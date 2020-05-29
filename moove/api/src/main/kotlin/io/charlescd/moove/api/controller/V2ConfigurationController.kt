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

package io.charlescd.moove.api.controller

import io.charlescd.moove.application.ResourcePageResponse
import io.charlescd.moove.application.configuration.*
import io.charlescd.moove.application.configuration.request.CreateGitConfigurationRequest
import io.charlescd.moove.application.configuration.request.CreateMetricConfigurationRequest
import io.charlescd.moove.application.configuration.request.UpdateGitConfigurationRequest
import io.charlescd.moove.application.configuration.response.GitConfigurationResponse
import io.charlescd.moove.application.configuration.response.MetricConfigurationResponse
import io.charlescd.moove.domain.PageRequest
import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiOperation
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

@Api(value = "Configuration Endpoints", tags = ["Configuration"])
@RestController
@RequestMapping("/v2/configurations")
class V2ConfigurationController(
    private val createGitConfigurationInteractor: CreateGitConfigurationInteractor,
    private val findGitConfigurationsInteractor: FindGitConfigurationsInteractor,
    private val deleteGitConfigurationByIdInteractor: DeleteGitConfigurationByIdInteractor,
    private val createMetricConfigurationInteractor: CreateMetricConfigurationInteractor,
    private val updateGitConfigurationInteractor: UpdateGitConfigurationInteractor
) {

    @ApiOperation(value = "Create git Configuration")
    @ApiImplicitParam(
        name = "request",
        value = "Git Configuration",
        required = true,
        dataType = "CreateGitConfigurationRequest"
    )
    @PostMapping("/git")
    @ResponseStatus(HttpStatus.CREATED)
    fun createGitConfiguration(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @Valid @RequestBody request: CreateGitConfigurationRequest
    ): GitConfigurationResponse {
        return this.createGitConfigurationInteractor.execute(request, workspaceId)
    }

    @ApiOperation(value = "Find git Configuration")
    @GetMapping("/git")
    @ResponseStatus(HttpStatus.OK)
    fun findGitConfigurations(
        @RequestHeader("x-workspace-id") workspaceId: String,
        pageRequest: PageRequest
    ): ResourcePageResponse<GitConfigurationResponse> {
        return this.findGitConfigurationsInteractor.execute(workspaceId, pageRequest)
    }

    @ApiOperation(value = "Delete Git Configuration By Id")
    @ApiImplicitParam(
        name = "id",
        value = "Git Configuration Id",
        required = true,
        dataType = "string",
        paramType = "path"
    )
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/git/{id}")
    fun deleteGitConfiguration(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable("id") id: String
    ) {
        this.deleteGitConfigurationByIdInteractor.execute(workspaceId, id)
    }

    @ApiOperation(value = "Create Metric Configuration")
    @ApiImplicitParam(
        name = "request",
        value = "Create Metric Configuration",
        required = true,
        dataType = "CreateMetricConfigurationRequest"
    )
    @PostMapping("/metric-configurations")
    @ResponseStatus(HttpStatus.CREATED)
    fun createMetricProvider(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @Valid @RequestBody request: CreateMetricConfigurationRequest
    ): MetricConfigurationResponse {
        return this.createMetricConfigurationInteractor.execute(request, workspaceId)
    }

    @ApiOperation(value = "Update git Configuration")
    @PutMapping("/git/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun updateGitConfiguration(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @Valid @PathVariable("id") id: String, @RequestBody request: UpdateGitConfigurationRequest
    ): GitConfigurationResponse {
        return this.updateGitConfigurationInteractor.execute(id, workspaceId, request)
    }

}
