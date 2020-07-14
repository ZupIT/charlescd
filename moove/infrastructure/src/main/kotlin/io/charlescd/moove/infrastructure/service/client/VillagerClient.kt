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

package io.charlescd.moove.infrastructure.service.client

import org.springframework.cloud.openfeign.FeignClient
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*

@FeignClient(name = "villagerClient", url = "\${charlescd.villager.url}")
interface VillagerClient {

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(
        value = ["/build"],
        produces = [MediaType.APPLICATION_JSON_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun build(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @RequestBody request: VillagerBuildRequest
    ): VillagerBuildResponse

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(
        value = ["/registry"],
        produces = [MediaType.APPLICATION_JSON_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun createRegistryConfiguration(
        @RequestBody request: CreateVillagerRegistryConfigurationRequest,
        @RequestHeader("x-workspace-id") applicationId: String
    ): CreateVillagerRegistryConfigurationResponse

    @ResponseStatus(HttpStatus.OK)
    @GetMapping(
        value = ["/registry"],
        produces = [MediaType.APPLICATION_JSON_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun findRegistryConfigurations(
        @RequestHeader("x-workspace-id") workspaceId: String
    ): List<FindVillagerRegistryConfigurationsResponse>

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping(
        value = ["/registry/{id}"],
        produces = [MediaType.APPLICATION_JSON_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun deleteRegistryConfiguration(
        @PathVariable("id") id: String,
        @RequestHeader("x-workspace-id") workspaceId: String
    )

    @ResponseStatus(HttpStatus.OK)
    @GetMapping(
        value = ["/registry/{registryConfigurationId}/components/{componentName}/tags"],
        produces = [MediaType.APPLICATION_JSON_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun findComponentTags(
        @PathVariable registryConfigurationId: String,
        @PathVariable componentName: String,
        @RequestParam name: String,
        @RequestHeader("x-workspace-id") workspaceId: String
    ): FindComponentTagsResponse
}
