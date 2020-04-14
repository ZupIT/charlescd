/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.api

import br.com.zup.darwin.moove.api.request.BuildRequest
import br.com.zup.darwin.moove.api.request.CreateVillagerRegistryConfigurationRequest
import br.com.zup.darwin.moove.api.response.*
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

@FeignClient(name = "villagerApi", url = "\${darwin.villager.url}")
interface VillagerApi {

    companion object {
        const val BUILD_URL = "/build"
        const val REGISTRY_URL = "/registry"
        const val COMPONENT_TAGS_URL = "$REGISTRY_URL/{registryConfigurationId}/components/{componentName}/tags"
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(
        value = [BUILD_URL],
        produces = [MediaType.APPLICATION_JSON_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun build(
        @Valid @RequestBody request: BuildRequest,
        @RequestHeader("x-application-id") applicationId: String
    ): BuildResponse

    @ResponseStatus(HttpStatus.CREATED)
    @GetMapping(
        value = [COMPONENT_TAGS_URL],
        produces = [MediaType.APPLICATION_JSON_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun getComponentTags(
        @PathVariable registryConfigurationId: String,
        @PathVariable componentName: String,
        @RequestHeader("x-application-id") applicationId: String
    ): ComponentTagsResponse

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(
        value = [REGISTRY_URL],
        produces = [MediaType.APPLICATION_JSON_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun createRegistryConfiguration(
        @Valid @RequestBody request: CreateVillagerRegistryConfigurationRequest,
        @RequestHeader("x-application-id") applicationId: String
    ): CreateVillagerRegistryConfigurationResponse

    @ResponseStatus(HttpStatus.OK)
    @GetMapping(
        value = [REGISTRY_URL],
        produces = [MediaType.APPLICATION_JSON_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun getRegistryConfigurations(
        @RequestHeader("x-application-id") applicationId: String
    ): List<GetVillagerRegistryConfigurationsResponse>

}