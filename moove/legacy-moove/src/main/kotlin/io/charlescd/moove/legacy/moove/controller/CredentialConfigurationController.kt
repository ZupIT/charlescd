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

import io.charlescd.moove.commons.representation.CredentialConfigurationRepresentation
import io.charlescd.moove.legacy.moove.request.configuration.CreateCdConfigurationRequest
import io.charlescd.moove.legacy.moove.request.configuration.CreateRegistryConfigurationRequest
import io.charlescd.moove.legacy.moove.service.CredentialConfigurationService
import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiOperation
import javax.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@Api(value = "Credential Configuration Endpoints", tags = ["Credential Configuration"])
@RestController
@RequestMapping("/config")
class CredentialConfigurationController(val credentialConfigurationService: CredentialConfigurationService) {

    @ApiOperation(value = "Create Registry Config")
    @ApiImplicitParam(
        name = "createRegistryConfigRequest",
        value = "Create Registry Config",
        required = true,
        dataType = "CreateRegistryConfigurationRequest"
    )
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/registry")
    fun createRegistryConfig(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @Valid @RequestBody createRegistryConfigRequest: CreateRegistryConfigurationRequest
    ): CredentialConfigurationRepresentation {
        return this.credentialConfigurationService.createRegistryConfig(createRegistryConfigRequest, workspaceId)
    }

    @ApiOperation(value = "Create CD Config")
    @ApiImplicitParam(
        name = "createCdConfigRequest",
        value = "Create CD Config",
        required = true,
        dataType = "CreateCdConfigurationRequest"
    )
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/cd")
    fun createCdConfig(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @Valid @RequestBody createCdConfigRequest: CreateCdConfigurationRequest
    ): CredentialConfigurationRepresentation {
        return this.credentialConfigurationService.createCdConfig(createCdConfigRequest, workspaceId)
    }

    @ApiOperation(value = "Get configurations by Type")
    @GetMapping
    fun getConfigurationsByType(@RequestHeader("x-workspace-id") workspaceId: String): Map<String, List<CredentialConfigurationRepresentation>> {
        return this.credentialConfigurationService.getConfigurationsByType(workspaceId)
    }

    @ApiOperation(value = "Get configurations by id")
    @GetMapping("/{id}")
    fun getConfigurationById(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable id: String
    ): CredentialConfigurationRepresentation {
        return this.credentialConfigurationService.getConfigurationById(id, workspaceId)
    }
}
