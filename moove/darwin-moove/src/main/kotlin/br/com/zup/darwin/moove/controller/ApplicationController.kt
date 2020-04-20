/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.controller

import br.com.zup.darwin.commons.representation.ApplicationRepresentation
import br.com.zup.darwin.commons.representation.ResourcePageRepresentation
import br.com.zup.darwin.commons.request.member.AddMemberRequest
import br.com.zup.darwin.moove.request.application.CreateApplicationRequest
import br.com.zup.darwin.moove.request.application.UpdateApplicationRequest
import br.com.zup.darwin.moove.service.ApplicationService
import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiOperation
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

@Api(value = "Application Endpoints", tags = ["Application"])
@RestController
@RequestMapping("/applications")
class ApplicationController(private val service: ApplicationService) {

    @ApiOperation(value = "Find all")
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    fun findAll(pageable: Pageable): ResourcePageRepresentation<ApplicationRepresentation> =
        service.findAll(pageable)

    @ApiOperation(value = "Find by id")
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun findById(@PathVariable id: String): ApplicationRepresentation =
        service.findById(id)

    @ApiOperation(value = "Create Application")
    @ApiImplicitParam(name = "createApplicationRequest", value = "Create Application", required = true, dataType = "CreateApplicationRequest")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@Valid @RequestBody createApplicationRequest: CreateApplicationRequest): ApplicationRepresentation =
        service.create(createApplicationRequest)

    @ApiOperation(value = "Update Application")
    @ApiImplicitParam(name = "updateApplicationRequest", value = "Update Application", required = true, dataType = "UpdateApplicationRequest")
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun update(@PathVariable id: String, @Valid @RequestBody updateApplicationRequest: UpdateApplicationRequest) {
        service.update(id, updateApplicationRequest)
    }

    @ApiOperation(value = "Delete by id")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable id: String) {
        service.delete(id)
    }

    @ApiOperation(value = "Add application members")
    @ApiImplicitParam(name = "addMemberRequest", value = "Add application members", required = true, dataType = "AddMemberRequest")
    @PostMapping("/{id}/members")
    fun addMembers(@PathVariable id: String, @Valid @RequestBody addMemberRequest: AddMemberRequest): ApplicationRepresentation =
        service.addMembers(id, addMemberRequest)

}