/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.controller

import br.com.zup.darwin.commons.representation.ComponentTagsRepresentation
import br.com.zup.darwin.commons.representation.ModuleRepresentation
import br.com.zup.darwin.commons.representation.ResourcePageRepresentation
import br.com.zup.darwin.moove.request.module.CreateModuleRequest
import br.com.zup.darwin.moove.request.module.UpdateModuleRequest
import br.com.zup.darwin.moove.service.ModuleService
import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiOperation
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import javax.validation.Valid
import javax.validation.constraints.NotBlank

@Api(value = "Module Endpoints", tags = ["Module"])
@RestController
@RequestMapping("/modules")
class ModuleController(private val moduleService: ModuleService) {

    @ApiOperation(value = "Create Module")
    @ApiImplicitParam(name = "createModuleRequest", value = "Create Module", required = true, dataType = "CreateModuleRequest")
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    fun createModule(
        @RequestHeader("x-application-id") applicationId: String,
        @Valid @RequestBody createModuleRequest: CreateModuleRequest
    ): ModuleRepresentation {
        return this.moduleService.createModule(createModuleRequest, applicationId)
    }

    @ApiOperation(value = "Find by id")
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun getModuleById(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable("id") id: String
    ): ModuleRepresentation {
        return this.moduleService.getModuleById(id, applicationId)
    }

    @ApiOperation(value = "Find all")
    @ResponseStatus(HttpStatus.OK)
    @GetMapping
    fun getAllModules(
        @RequestHeader("x-application-id") applicationId: String,
        @RequestParam(
            name = "name",
            required = false
        ) name: String?, pageable: Pageable
    ): ResourcePageRepresentation<ModuleRepresentation> {
        return this.moduleService.getAllModules(name, applicationId, pageable)
    }

    @ApiOperation(value = "Delete by id")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    fun deleteModuleById(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable("id") id: String
    ) {
        return this.moduleService.deleteModuleById(id, applicationId)
    }

    @ApiOperation(value = "Update Module by id")
    @ApiImplicitParam(name = "updateModuleRequest", value = "Update Module by id", required = true, dataType = "UpdateModuleRequest")
    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/{id}")
    fun updateModuleById(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable("id") id: String,
        @Valid @RequestBody updateModuleRequest: UpdateModuleRequest
    ): ModuleRepresentation {
        return this.moduleService.updateModuleById(id, updateModuleRequest, applicationId)
    }

    @ApiOperation(value = "Find components tags")
    @GetMapping("/components/{componentId}/tags")
    fun getComponentsTags(
        @RequestHeader("x-application-id") applicationId: String,
        @NotBlank @PathVariable("componentId") componentId: String
    ): ComponentTagsRepresentation {
        return this.moduleService.getComponentTags(componentId, applicationId)
    }
}
