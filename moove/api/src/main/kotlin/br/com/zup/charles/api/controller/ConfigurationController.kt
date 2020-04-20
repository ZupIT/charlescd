/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.api.controller

import br.com.zup.charles.application.build.response.ResourcePageResponse
import br.com.zup.charles.application.configuration.CreateGitConfigurationInteractor
import br.com.zup.charles.application.configuration.FindGitConfigurationsInteractor
import br.com.zup.charles.application.configuration.request.CreateGitConfigurationRequest
import br.com.zup.charles.application.configuration.response.GitConfigurationResponse
import br.com.zup.charles.domain.PageRequest
import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiOperation
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

@Api(value = "Configuration Endpoints", tags = ["Configuration"])
@RestController
@RequestMapping("/v2/configurations")
class ConfigurationController(
    private val createGitConfigurationInteractor: CreateGitConfigurationInteractor,
    private val findGitConfigurationsInteractor: FindGitConfigurationsInteractor
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
        @RequestHeader("x-application-id") applicationId: String,
        @Valid @RequestBody request: CreateGitConfigurationRequest
    ): GitConfigurationResponse {
        return this.createGitConfigurationInteractor.execute(request, applicationId)
    }

    @ApiOperation(value = "Find git Configuration")
    @GetMapping("/git")
    @ResponseStatus(HttpStatus.OK)
    fun findGitConfigurations(
        @RequestHeader("x-application-id") applicationId: String,
        pageRequest: PageRequest
    ): ResourcePageResponse<GitConfigurationResponse> {
        return this.findGitConfigurationsInteractor.execute(applicationId, pageRequest)
    }
}