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

package io.charlescd.moove.legacy.moove.controller

import io.charlescd.moove.commons.representation.DeploymentRepresentation
import io.charlescd.moove.commons.representation.ResourcePageRepresentation
import io.charlescd.moove.legacy.moove.service.DeploymentServiceLegacy
import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@Api(value = "Deployment Endpoints", tags = ["Deployment"])
@RestController
@RequestMapping("/deployments")
class DeploymentController(private val deploymentService: DeploymentServiceLegacy) {

    @ApiOperation(value = "Get Deployment by id")
    @GetMapping("/{id}")
    fun getDeploymentById(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable("id") id: String
    ): DeploymentRepresentation {
        return this.deploymentService.getDeploymentById(id, workspaceId)
    }

    @ApiOperation(value = "Find all")
    @GetMapping
    fun getAllDeployments(
        @RequestHeader("x-workspace-id") workspaceId: String,
        pageable: Pageable
    ): ResourcePageRepresentation<DeploymentRepresentation> {
        return this.deploymentService.getAllDeployments(workspaceId, pageable)
    }

    @ApiOperation(value = "Delete by id")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    fun deleteDeploymentById(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable("id") id: String
    ) {
        return this.deploymentService.deleteDeploymentById(id, workspaceId)
    }

    @ApiOperation(value = "Undeploy")
    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/{id}/undeploy")
    fun undeploy(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable("id") id: String
    ) {
        return this.deploymentService.undeploy(id, workspaceId)
    }
}
