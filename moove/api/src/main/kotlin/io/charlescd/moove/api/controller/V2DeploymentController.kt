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
import io.charlescd.moove.application.deployment.*
import io.charlescd.moove.application.deployment.request.CreateDeploymentRequest
import io.charlescd.moove.application.deployment.request.DeploymentCallbackRequest
import io.charlescd.moove.application.deployment.request.DeploymentHistoryFilterRequest
import io.charlescd.moove.application.deployment.response.DeploymentHistoryResponse
import io.charlescd.moove.application.deployment.response.DeploymentResponse
import io.charlescd.moove.application.deployment.response.SummarizedDeploymentHistoryResponse
import io.charlescd.moove.domain.PageRequest
import io.charlescd.moove.infrastructure.service.client.response.LogResponse
import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiOperation
import javax.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@Api(value = "Deployment Endpoints", tags = ["Deployment"])
@RestController
@RequestMapping("/v2/deployments")
class V2DeploymentController(
    private val deploymentCallbackInteractor: DeploymentCallbackInteractor,
    private val createDeploymentInteractor: CreateDeploymentInteractor,
    private val findDeploymentsHistoryForCircleInteractor: FindDeploymentsHistoryForCircleInteractor,
    private val findDeploymentsHistoryInteractor: FindDeploymentsHistoryInteractor,
    private val undeployInteractor: UndeployInteractor,
    private val findDeploymentLogsInteractor: FindDeploymentLogsInteractor
) {
    @ApiOperation(value = "Create Deployment")
    @ApiImplicitParam(
        name = "createDeploymentRequest",
        value = "Create Deployment",
        required = true,
        dataType = "CreateDeploymentRequest"
    )
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    fun createDeployment(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @RequestHeader(value = "Authorization", required = false) authorization: String?,
        @RequestHeader(value = "x-charles-token", required = false) token: String?,
        @Valid @RequestBody createDeploymentRequest: CreateDeploymentRequest
    ): DeploymentResponse {
        return this.createDeploymentInteractor.execute(createDeploymentRequest, workspaceId, authorization, token)
    }

    @ApiOperation(value = "Undeploy Deployment")
    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/{deploymentId}/undeploy")
    fun undeploy(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @RequestHeader(value = "Authorization", required = false) authorization: String?,
        @RequestHeader(value = "x-charles-token", required = false) token: String?,
        @PathVariable("deploymentId") deploymentId: String
    ) {
        return this.undeployInteractor.execute(workspaceId, authorization, token, deploymentId)
    }

    @ApiOperation(value = "Deployment Callback")
    @ApiImplicitParam(
        name = "request",
        value = "Deployment Callback payload",
        required = true,
        dataType = "DeploymentCallbackRequest"
    )
    @PostMapping("/{id}/callback")
    @ResponseStatus(HttpStatus.OK)
    fun deploymentCallback(@PathVariable("id") id: String, @RequestBody @Valid request: DeploymentCallbackRequest) {
        return this.deploymentCallbackInteractor.execute(id, request)
    }

    @ApiOperation(value = "Get Deployment History for Circle")
    @GetMapping("/circle/{circleId}/history")
    @ResponseStatus(HttpStatus.OK)
    fun deploymentHistoryForCircle(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable("circleId") circle: String,
        @Valid pageRequest: PageRequest
    ): ResourcePageResponse<DeploymentHistoryResponse> {
        return this.findDeploymentsHistoryForCircleInteractor.execute(workspaceId, circle, pageRequest)
    }

    @ApiOperation(value = "Get Deployment History")
    @PostMapping("/history")
    @ResponseStatus(HttpStatus.OK)
    fun deploymentsHistory(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @RequestBody filters: DeploymentHistoryFilterRequest,
        pageRequest: PageRequest
    ): SummarizedDeploymentHistoryResponse {
        return this.findDeploymentsHistoryInteractor.execute(workspaceId, filters, pageRequest)
    }

    @ApiOperation(value = "Get deployment logs")
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/{deploymentId}/logs")
    fun deploymentLogs(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @RequestHeader(value = "Authorization", required = false) authorization: String?,
        @RequestHeader(value = "x-charles-token", required = false) token: String?,
        @PathVariable("deploymentId") deploymentId: String
    ): LogResponse {
        return this.findDeploymentLogsInteractor.execute(workspaceId, authorization, token, deploymentId)
    }
}
