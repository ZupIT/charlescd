/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.controller

import br.com.zup.darwin.commons.extension.toResourcePageRepresentation
import br.com.zup.darwin.commons.representation.FeatureRepresentation
import br.com.zup.darwin.commons.representation.ResourcePageRepresentation
import br.com.zup.darwin.moove.request.feature.CreateFeatureRequest
import br.com.zup.darwin.moove.request.feature.UpdateFeatureRequest
import br.com.zup.darwin.moove.service.FeatureService
import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiOperation
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

@Api(value = "Features Endpoints", tags = ["Feature"])
@RestController
@RequestMapping("/features")
class FeatureController(private val service: FeatureService) {

    @ApiOperation(value = "Create Feature")
    @ApiImplicitParam(name = "createFeatureRequest", value = "Create Feature", required = true, dataType = "CreateFeatureRequest")
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    fun create(
        @RequestHeader("x-application-id") applicationId: String,
        @Valid @RequestBody createFeatureRequest: CreateFeatureRequest
    ): FeatureRepresentation =
        service.create(createFeatureRequest, applicationId)

    @ApiOperation(value = "Find all")
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    fun findAll(
        @RequestHeader("x-application-id") applicationId: String,
        pageable: Pageable
    ): ResourcePageRepresentation<FeatureRepresentation> =
        service.findAll(applicationId, pageable).toResourcePageRepresentation()

    @ApiOperation(value = "Find by id")
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun findById(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable id: String
    ): FeatureRepresentation =
        service.findById(id, applicationId)

    @ApiOperation(value = "Update by id")
    @ApiImplicitParam(name = "updateFeatureRequest", value = "Update by id", required = true, dataType = "UpdateFeatureRequest")
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun update(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable id: String,
        @Valid @RequestBody updateFeatureRequest: UpdateFeatureRequest
    ) {
        service.update(id, updateFeatureRequest, applicationId)
    }

    @ApiOperation(value = "Delete by id")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable id: String
    ) {
        service.delete(id, applicationId)
    }

}
