/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.controller

import br.com.zup.darwin.commons.representation.DeploymentRepresentation
import br.com.zup.darwin.commons.representation.ResourcePageRepresentation
import br.com.zup.darwin.moove.request.deployment.CreateDeploymentRequest
import br.com.zup.darwin.moove.service.DeploymentService
import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiOperation
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

@Api(value = "Deployment Endpoints", tags = ["Deployment"])
@RestController
@RequestMapping("/deployments")
class DeploymentController(private val deploymentService: DeploymentService) {

    @ApiOperation(value = "Create Deployment")
    @ApiImplicitParam(name = "createDeploymentRequest", value = "Create Deployment", required = true, dataType = "CreateDeploymentRequest")
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    fun createDeployment(
        @RequestHeader("x-application-id") applicationId: String,
        @Valid @RequestBody createDeploymentRequest: CreateDeploymentRequest
    ): DeploymentRepresentation {
        return this.deploymentService
            .createDeployment(createDeploymentRequest, applicationId)
    }

    @ApiOperation(value = "Get Deployment by id")
    @GetMapping("/{id}")
    fun getDeploymentById(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable("id") id: String
    ): DeploymentRepresentation {
        return this.deploymentService.getDeploymentById(id, applicationId)
    }

    @ApiOperation(value = "Find all")
    @GetMapping
    fun getAllDeployments(
        @RequestHeader("x-application-id") applicationId: String,
        pageable: Pageable
    ): ResourcePageRepresentation<DeploymentRepresentation> {
        return this.deploymentService.getAllDeployments(applicationId, pageable)
    }

    @ApiOperation(value = "Delete by id")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    fun deleteDeploymentById(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable("id") id: String
    ) {
        return this.deploymentService.deleteDeploymentById(id, applicationId)
    }

    @ApiOperation(value = "Undeploy")
    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/{id}/undeploy")
    fun undeploy(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable("id") id: String
    ) {
        return this.deploymentService.undeploy(id, applicationId)
    }

}
