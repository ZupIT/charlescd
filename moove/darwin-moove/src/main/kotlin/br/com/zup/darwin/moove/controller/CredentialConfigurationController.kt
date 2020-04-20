/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.controller

import br.com.zup.darwin.commons.representation.CredentialConfigurationRepresentation
import br.com.zup.darwin.moove.request.configuration.CreateCdConfigurationRequest
import br.com.zup.darwin.moove.request.configuration.CreateRegistryConfigurationRequest
import br.com.zup.darwin.moove.service.CredentialConfigurationService
import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiOperation
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

@Api(value = "Credential Configuration Endpoints", tags = ["Credential Configuration"])
@RestController
@RequestMapping("/config")
class CredentialConfigurationController(val credentialConfigurationService: CredentialConfigurationService) {

    @ApiOperation(value = "Create Registry Config")
    @ApiImplicitParam(name = "createRegistryConfigRequest", value = "Create Registry Config", required = true, dataType = "CreateRegistryConfigurationRequest")
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/registry")
    fun createRegistryConfig(
        @RequestHeader("x-application-id") applicationId: String,
        @Valid @RequestBody createRegistryConfigRequest: CreateRegistryConfigurationRequest
    ): CredentialConfigurationRepresentation {
        return this.credentialConfigurationService.createRegistryConfig(createRegistryConfigRequest, applicationId)
    }

    @ApiOperation(value = "Create CD Config")
    @ApiImplicitParam(name = "createCdConfigRequest", value = "Create CD Config", required = true, dataType = "CreateCdConfigurationRequest")
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/cd")
    fun createCdConfig(
        @RequestHeader("x-application-id") applicationId: String,
        @Valid @RequestBody createCdConfigRequest: CreateCdConfigurationRequest
    ): CredentialConfigurationRepresentation {
        return this.credentialConfigurationService.createCdConfig(createCdConfigRequest, applicationId)
    }

    @ApiOperation(value = "Get configurations by Type")
    @GetMapping
    fun getConfigurationsByType(@RequestHeader("x-application-id") applicationId: String): Map<String, List<CredentialConfigurationRepresentation>> {
        return this.credentialConfigurationService.getConfigurationsByType(applicationId)
    }

    @ApiOperation(value = "Get configurations by id")
    @GetMapping("/{id}")
    fun getConfigurationById(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable id: String
    ): CredentialConfigurationRepresentation {
        return this.credentialConfigurationService.getConfigurationById(id, applicationId)
    }
}