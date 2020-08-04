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

package io.charlescd.moove.api.controller

import io.charlescd.moove.application.ResourcePageResponse
import io.charlescd.moove.application.build.response.ComponentResponse
import io.charlescd.moove.application.module.*
import io.charlescd.moove.application.module.request.ComponentRequest
import io.charlescd.moove.application.module.request.CreateModuleRequest
import io.charlescd.moove.application.module.request.UpdateModuleRequest
import io.charlescd.moove.application.module.response.ComponentTagResponse
import io.charlescd.moove.application.module.response.ModuleResponse
import io.charlescd.moove.domain.PageRequest
import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiOperation
import javax.validation.Valid
import javax.validation.constraints.NotBlank
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@Api(value = "Module Endpoints", tags = ["Module"])
@RestController
@RequestMapping("/v2/modules")
class V2ModuleController(
    private val createModuleInteractor: CreateModuleInteractor,
    private val updateModuleInteractor: UpdateModuleInteractor,
    private val addComponentInteractor: AddComponentInteractor,
    private val removeComponentInteractor: RemoveComponentInteractor,
    private val updateComponentInteractor: UpdateComponentInteractor,
    private val findModuleByIdInteractor: FindModuleByIdInteractor,
    private val findAllModulesInteractor: FindAllModulesInteractor,
    private val deleteModuleByIdInteractor: DeleteModuleByIdInteractor,
    private val findComponentTagsInteractor: FindComponentTagsInteractor
) {

    @ApiOperation(value = "Create Module")
    @ApiImplicitParam(
        name = "request",
        value = "Create Module",
        required = true,
        dataType = "CreateModuleRequest"
    )
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    fun create(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @Valid @RequestBody request: CreateModuleRequest
    ): ModuleResponse {
        return createModuleInteractor.execute(request, workspaceId)
    }

    @ApiOperation(value = "Find Module by id")
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun findModuleById(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable("id") id: String
    ): ModuleResponse {
        return this.findModuleByIdInteractor.execute(id, workspaceId)
    }

    @ApiOperation(value = "Find All Modules")
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    fun findAllModules(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @RequestParam("name", required = false) name: String?,
        pageRequest: PageRequest
    ): ResourcePageResponse<ModuleResponse> {
        return this.findAllModulesInteractor.execute(workspaceId, name, pageRequest)
    }

    @ApiOperation(value = "Update Module by id")
    @ApiImplicitParam(
        name = "request",
        value = "Update Module by id",
        required = true,
        dataType = "UpdateModuleRequest"
    )
    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/{id}")
    fun updateModuleById(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable("id") id: String,
        @Valid @RequestBody request: UpdateModuleRequest
    ): ModuleResponse {
        return updateModuleInteractor.execute(id, workspaceId, request)
    }

    @ApiOperation(value = "Add Component to Module")
    @ApiImplicitParam(
        name = "request",
        value = "Add Component to Module",
        required = true,
        dataType = "ComponentRequest"
    )
    @ResponseStatus(HttpStatus.OK)
    @PostMapping(path = ["/{id}/components"])
    fun addComponent(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable("id") id: String,
        @Valid @RequestBody request: ComponentRequest
    ): ComponentResponse {
        return addComponentInteractor.execute(id, workspaceId, request)
    }

    @ApiOperation(value = "Remove Component from Module")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping(path = ["/{moduleId}/components/{componentId}"])
    fun removeComponent(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable("moduleId") moduleId: String,
        @PathVariable("componentId") componentId: String
    ) {
        removeComponentInteractor.execute(moduleId, componentId, workspaceId)
    }

    @ApiOperation(value = "Update component from module")
    @ApiImplicitParam(
        name = "request",
        value = "Update component from Module",
        required = true,
        dataType = "ComponentRequest"
    )
    @ResponseStatus(HttpStatus.OK)
    @PutMapping(path = ["/{id}/components/{componentId}"])
    fun updateComponent(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable("id") id: String,
        @PathVariable("componentId") componentId: String,
        @Valid @RequestBody request: ComponentRequest
    ): ComponentResponse {
        return updateComponentInteractor.execute(id, componentId, workspaceId, request)
    }

    @ApiOperation(value = "Delete Module by id")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping(path = ["/{id}"])
    fun deleteModule(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable("id") id: String
    ) {
        deleteModuleByIdInteractor.execute(id, workspaceId)
    }

    @ApiOperation(value = "Find Component tags")
    @GetMapping("/{moduleId}/components/{componentId}/tags")
    fun findComponentsTags(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @NotBlank @PathVariable("moduleId") moduleId: String,
        @NotBlank @PathVariable("componentId") componentId: String,
        @NotBlank @RequestParam("name") name: String
    ): List<ComponentTagResponse> {
        return findComponentTagsInteractor.execute(moduleId, componentId, name, workspaceId)
    }
}
