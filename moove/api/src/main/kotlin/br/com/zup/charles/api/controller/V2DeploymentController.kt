/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.api.controller

import br.com.zup.charles.application.deployment.CreateDeploymentInteractor
import br.com.zup.charles.application.deployment.DeploymentCallbackInteractor
import br.com.zup.charles.application.deployment.request.CreateDeploymentRequest
import br.com.zup.charles.application.deployment.request.DeploymentCallbackRequest
import br.com.zup.charles.application.deployment.response.DeploymentResponse
import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiOperation
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

@Api(value = "Deployment Endpoints", tags = ["Deployment"])
@RestController
@RequestMapping("/v2/deployments")
class V2DeploymentController(
    private val deploymentCallbackInteractor: DeploymentCallbackInteractor,
    private val createDeploymentInteractor: CreateDeploymentInteractor
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
        @RequestHeader("x-application-id") applicationId: String,
        @Valid @RequestBody createDeploymentRequest: CreateDeploymentRequest
    ): DeploymentResponse {
        return this.createDeploymentInteractor.execute(createDeploymentRequest, applicationId)
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


}