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
import io.charlescd.moove.commons.representation.*
import io.charlescd.moove.legacy.moove.request.hypothesis.CreateHypothesisRequest
import io.charlescd.moove.legacy.moove.request.hypothesis.OrderCardInColumnRequest
import io.charlescd.moove.legacy.moove.request.hypothesis.UpdateCardColumnRequest
import io.charlescd.moove.legacy.moove.request.hypothesis.UpdateHypothesisRequest
import io.charlescd.moove.legacy.moove.service.HypothesisServiceLegacy
import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiOperation
import javax.validation.Valid
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@Api(value = "Hypothesis Endpoints", tags = ["Hypothesis"])
@RestController
@RequestMapping("/hypotheses")
class HypothesisController(private val hypothesisService: HypothesisServiceLegacy) {

    @ApiOperation(value = "Find all")
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    fun findAll(
        @RequestHeader("x-workspace-id") workspaceId: String,
        pageable: Pageable
    ): ResourcePageRepresentation<HypothesisRepresentation> =
        this.hypothesisService.findAll(workspaceId, pageable).toResourcePageRepresentation()

    @ApiOperation(value = "Find by id")
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun findById(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable id: String
    ): HypothesisRepresentation =
        this.hypothesisService.findHypothesisById(id, workspaceId)

    @ApiOperation(value = "Create Hypothesis")
    @ApiImplicitParam(
        name = "request",
        value = "Create Hypothesis",
        required = true,
        dataType = "CreateHypothesisRequest"
    )
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @Valid @RequestBody request: CreateHypothesisRequest
    ): HypothesisRepresentation =
        this.hypothesisService.create(request, workspaceId)

    @ApiOperation(value = "Update Hypothesis")
    @ApiImplicitParam(
        name = "request",
        value = "Update Hypothesis",
        required = true,
        dataType = "UpdateHypothesisRequest"
    )
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun update(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable id: String,
        @Valid @RequestBody request: UpdateHypothesisRequest
    ): HypothesisRepresentation =
        this.hypothesisService.update(id, request, workspaceId)

    @ApiOperation(value = "Delete by id")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable id: String
    ) {
        this.hypothesisService.delete(id, workspaceId)
    }

    @ApiOperation(value = "Add labels")
    @PostMapping("/{id}/labels")
    @ResponseStatus(HttpStatus.OK)
    fun addLabels(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable id: String,
        @RequestBody labelIds: List<String>
    ): HypothesisRepresentation {
        return this.hypothesisService.addLabels(id, labelIds, workspaceId)
    }

    @ApiOperation(value = "Remove labels")
    @DeleteMapping("/{id}/labels/{labelId}")
    @ResponseStatus(HttpStatus.OK)
    fun removeLabel(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable id: String,
        @PathVariable labelId: String
    ) {
        this.hypothesisService.removeLabel(id, labelId, workspaceId)
    }

    @ApiOperation(value = "Get board")
    @GetMapping("/{id}/board")
    @ResponseStatus(HttpStatus.OK)
    fun getBoard(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable id: String
    ): HypothesisBoardRepresentation {
        return this.hypothesisService.getBoard(id, workspaceId)
    }

    @ApiOperation(value = "Order cards in column")
    @PatchMapping("/{id}/cards")
    @ResponseStatus(HttpStatus.OK)
    fun orderCardsInColumn(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable id: String,
        @RequestBody request: OrderCardInColumnRequest
    ): List<CardsByColumnsRepresentation> {
        return this.hypothesisService.orderCardsInColumn(id, request, workspaceId)
    }

    @ApiOperation(value = "Update cards column")
    @PatchMapping("/{id}/cards/{cardId}/column")
    @ResponseStatus(HttpStatus.OK)
    fun updateCardColumn(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable id: String,
        @PathVariable cardId: String,
        @RequestBody request: UpdateCardColumnRequest
    ): List<CardsByColumnsRepresentation> =
        this.hypothesisService.updateCardColumn(id, cardId, request, workspaceId)

    @ApiOperation(value = "Find Hypothesis Validated Build")
    @GetMapping("/{id}/builds/validated")
    @ResponseStatus(HttpStatus.OK)
    fun findHypothesisValidatedBuilds(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable id: String
    ): List<SimpleBuildRepresentation> {
        return this.hypothesisService.findValidatedBuildsByHypothesisId(id, workspaceId)
    }

    @ApiOperation(value = "Find Event Status")
    @GetMapping("/{id}/events/status")
    @ResponseStatus(HttpStatus.OK)
    fun findEventsStatus(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable id: String
    ) = this.hypothesisService.getBoardActiveEvents(id, workspaceId)
}
