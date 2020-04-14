/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.controller

import br.com.zup.darwin.commons.extension.toResourcePageRepresentation
import br.com.zup.darwin.commons.representation.LabelRepresentation
import br.com.zup.darwin.commons.representation.ResourcePageRepresentation
import br.com.zup.darwin.moove.request.label.CreateLabelRequest
import br.com.zup.darwin.moove.request.label.UpdateLabelRequest
import br.com.zup.darwin.moove.service.LabelService
import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiOperation
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

@Api(value = "Label Endpoints", tags = ["Label"])
@RestController
@RequestMapping("/labels")
class LabelController(
    private val service: LabelService
) {
    @ApiOperation(value = "Find all")
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    fun findAll(pageable: Pageable): ResourcePageRepresentation<LabelRepresentation> =
        service.findAll(pageable).toResourcePageRepresentation()

    @ApiOperation(value = "Find by id")
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun findById(@PathVariable id: String): LabelRepresentation =
        service.findById(id)

    @ApiOperation(value = "Create Label")
    @ApiImplicitParam(name = "createLabelRequest", value = "Create Label", required = true, dataType = "CreateLabelRequest")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@Valid @RequestBody createLabelRequest: CreateLabelRequest): LabelRepresentation =
        service.create(createLabelRequest)

    @ApiOperation(value = "Update Label")
    @ApiImplicitParam(name = "updateLabelRequest", value = "Update Label", required = true, dataType = "UpdateLabelRequest")
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun update(@PathVariable id: String, @Valid @RequestBody updateLabelRequest: UpdateLabelRequest) {
        service.update(id, updateLabelRequest)
    }

    @ApiOperation(value = "Delete by id")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable id: String) {
        service.delete(id)
    }
}
