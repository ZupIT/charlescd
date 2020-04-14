/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.api

import br.com.zup.darwin.moove.api.request.*
import br.com.zup.darwin.moove.api.response.*
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

@FeignClient(name = "deployApi", url = "\${darwin.deploy.url}")
interface DeployApi {

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(
        value = ["/deployments/circle"],
        produces = [MediaType.APPLICATION_JSON_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun deployInSegmentedCircle(@Valid @RequestBody request: DeployRequest): DeployResponse

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(
        value = ["/deployments/default"],
        produces = [MediaType.APPLICATION_JSON_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun deployInDefaultCircle(@Valid @RequestBody request: DeployRequest): DeployResponse

    @ResponseStatus(HttpStatus.OK)
    @PostMapping(
        value = ["/deployments/{id}/undeploy"],
        produces = [MediaType.APPLICATION_JSON_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun undeploy(@PathVariable("id") id: String, @Valid @RequestBody request: UndeployRequest): UndeployResponse

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(
            value = ["/configurations/cd"],
            produces = [MediaType.APPLICATION_JSON_VALUE],
            consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun createCdConfiguration(
            @Valid @RequestBody request: CreateDeployCdConfigurationRequest,
            @RequestHeader("x-application-id") applicationId: String
    ): CreateDeployCdConfigurationResponse

    @ResponseStatus(HttpStatus.OK)
    @GetMapping(
            value = ["/configurations/cd"],
            produces = [MediaType.APPLICATION_JSON_VALUE],
            consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun getCdConfigurations(
            @RequestHeader("x-application-id") applicationId: String
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
}