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

package io.charlescd.moove.legacy.moove.api

import io.charlescd.moove.legacy.moove.api.request.BuildRequest
import io.charlescd.moove.legacy.moove.api.request.CreateVillagerRegistryConfigurationRequest
import io.charlescd.moove.legacy.moove.api.response.BuildResponse
import io.charlescd.moove.legacy.moove.api.response.ComponentTagsResponse
import io.charlescd.moove.legacy.moove.api.response.CreateVillagerRegistryConfigurationResponse
import io.charlescd.moove.legacy.moove.api.response.GetVillagerRegistryConfigurationsResponse
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

@FeignClient(name = "villagerApi", url = "\${charlescd.villager.url}")
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
        @RequestHeader("x-workspace-id") workspaceId: String
    ): BuildResponse

    @ResponseStatus(HttpStatus.OK)
    @GetMapping(
        value = [COMPONENT_TAGS_URL],
        produces = [MediaType.APPLICATION_JSON_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun getComponentTags(
        @PathVariable registryConfigurationId: String,
        @PathVariable componentName: String,
        @RequestHeader("x-workspace-id") workspaceId: String
    ): ComponentTagsResponse

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(
        value = [REGISTRY_URL],
        produces = [MediaType.APPLICATION_JSON_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun createRegistryConfiguration(
        @Valid @RequestBody request: CreateVillagerRegistryConfigurationRequest,
        @RequestHeader("x-workspace-id") workspaceId: String
    ): CreateVillagerRegistryConfigurationResponse

    @ResponseStatus(HttpStatus.OK)
    @GetMapping(
        value = [REGISTRY_URL],
        produces = [MediaType.APPLICATION_JSON_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun getRegistryConfigurations(
        @RequestHeader("x-workspace-id") workspaceId: String
    ): List<GetVillagerRegistryConfigurationsResponse>

}
