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

package io.charlescd.moove.legacy.moove.controller

import io.charlescd.moove.commons.extension.toResourcePageRepresentation
import io.charlescd.moove.commons.representation.LabelRepresentation
import io.charlescd.moove.commons.representation.ResourcePageRepresentation
import io.charlescd.moove.legacy.moove.request.label.CreateLabelRequest
import io.charlescd.moove.legacy.moove.request.label.UpdateLabelRequest
import io.charlescd.moove.legacy.moove.service.LabelService
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
    @ApiImplicitParam(
        name = "createLabelRequest",
        value = "Create Label",
        required = true,
        dataType = "CreateLabelRequest"
    )
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@Valid @RequestBody createLabelRequest: CreateLabelRequest): LabelRepresentation =
        service.create(createLabelRequest)

    @ApiOperation(value = "Update Label")
    @ApiImplicitParam(
        name = "updateLabelRequest",
        value = "Update Label",
        required = true,
        dataType = "UpdateLabelRequest"
    )
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
