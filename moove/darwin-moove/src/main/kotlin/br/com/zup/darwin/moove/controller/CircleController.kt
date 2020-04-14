/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.controller

import br.com.zup.darwin.commons.representation.ResourcePageRepresentation
import br.com.zup.darwin.commons.representation.SimpleCircleRepresentation
import br.com.zup.darwin.moove.request.circle.CreateCircleRequest
import br.com.zup.darwin.moove.request.circle.UpdateCircleRequest
import br.com.zup.darwin.moove.service.CircleService
import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiOperation
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import javax.validation.Valid

@Api(value = "Circle Endpoints", tags = ["Circle"])
@RestController
@RequestMapping("/circles")
class CircleController(
    private val service: CircleService
) {

    @ApiOperation(value = "Create circle")
    @ApiImplicitParam(name = "createCircleRequest", value = "Create circle", required = true, dataType = "CreateCircleRequest")
    @PostMapping
    fun create(
        @Valid @RequestBody createCircleRequest: CreateCircleRequest
    ) = service.create(createCircleRequest)

    @ApiOperation(value = "Find all")
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    fun findAll(
        @RequestParam(name = "name", required = false) name: String?,
        @RequestParam(name = "active", required = false) active: Boolean?,
        pageable: Pageable
    ): ResourcePageRepresentation<SimpleCircleRepresentation> =
        service.findAll(name, active ?: true, pageable)

    @ApiOperation(value = "Find by id")
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun findById(
        @PathVariable id: String
    ) = service.findById(id)

    @ApiOperation(value = "Update circle")
    @ApiImplicitParam(name = "updateCircleRequest", value = "Update circle", required = true, dataType = "UpdateCircleRequest")
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun update(
        @PathVariable id: String,
        @Valid @RequestBody updateCircleRequest: UpdateCircleRequest
    ) = service.update(id, updateCircleRequest)

    @ApiOperation(value = "Delete by id")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(
        @PathVariable id: String
    ) {
        service.delete(id)
    }

    @ApiOperation(value = "Create circle with CSV")
    @PostMapping("/csv", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    @ResponseStatus(HttpStatus.CREATED)
    fun createWithCsv(
        @RequestParam("name") name: String,
        @RequestParam("authorId") authorId: String,
        @RequestParam("keyName") keyName: String,
        @RequestParam("file") file: MultipartFile
    ) = service.createWithCsv(name, authorId, keyName, file)

    @ApiOperation(value = "Update circle with CSV")
    @PutMapping("/{id}/csv", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    @ResponseStatus(HttpStatus.OK)
    fun updateWithCsv(
        @PathVariable("id") id: String,
        @RequestParam("name") name: String,
        @RequestParam("keyName", required = false) keyName: String?,
        @RequestParam("file", required = false) file: MultipartFile?
    ) = service.updateWithCsv(id, name, keyName, file)
}
