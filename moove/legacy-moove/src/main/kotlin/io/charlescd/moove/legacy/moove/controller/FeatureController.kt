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
import io.charlescd.moove.commons.representation.FeatureRepresentation
import io.charlescd.moove.commons.representation.ResourcePageRepresentation
import io.charlescd.moove.legacy.moove.request.feature.CreateFeatureRequest
import io.charlescd.moove.legacy.moove.request.feature.UpdateFeatureRequest
import io.charlescd.moove.legacy.moove.service.FeatureService
import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiOperation
import javax.validation.Valid
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@Api(value = "Features Endpoints", tags = ["Feature"])
@RestController
@RequestMapping("/features")
class FeatureController(private val service: FeatureService) {

    @ApiOperation(value = "Create Feature")
    @ApiImplicitParam(
        name = "createFeatureRequest",
        value = "Create Feature",
        required = true,
        dataType = "CreateFeatureRequest"
    )
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    fun create(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @Valid @RequestBody createFeatureRequest: CreateFeatureRequest
    ): FeatureRepresentation =
        service.create(createFeatureRequest, workspaceId)

    @ApiOperation(value = "Find all")
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    fun findAll(
        @RequestHeader("x-workspace-id") workspaceId: String,
        pageable: Pageable
    ): ResourcePageRepresentation<FeatureRepresentation> =
        service.findAll(workspaceId, pageable).toResourcePageRepresentation()

    @ApiOperation(value = "Find by id")
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun findById(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable id: String
    ): FeatureRepresentation =
        service.findById(id, workspaceId)

    @ApiOperation(value = "Update by id")
    @ApiImplicitParam(
        name = "updateFeatureRequest",
        value = "Update by id",
        required = true,
        dataType = "UpdateFeatureRequest"
    )
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun update(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable id: String,
        @Valid @RequestBody updateFeatureRequest: UpdateFeatureRequest
    ) {
        service.update(id, updateFeatureRequest, workspaceId)
    }

    @ApiOperation(value = "Delete by id")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable id: String
    ) {
        service.delete(id, workspaceId)
    }
}
