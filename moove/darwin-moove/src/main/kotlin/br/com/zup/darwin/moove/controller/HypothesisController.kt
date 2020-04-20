/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.controller

import br.com.zup.darwin.commons.extension.toResourcePageRepresentation
import br.com.zup.darwin.commons.representation.*
import br.com.zup.darwin.moove.request.hypothesis.CreateHypothesisRequest
import br.com.zup.darwin.moove.request.hypothesis.OrderCardInColumnRequest
import br.com.zup.darwin.moove.request.hypothesis.UpdateCardColumnRequest
import br.com.zup.darwin.moove.request.hypothesis.UpdateHypothesisRequest
import br.com.zup.darwin.moove.service.HypothesisService
import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiOperation
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

@Api(value = "Hypothesis Endpoints", tags = ["Hypothesis"])
@RestController
@RequestMapping("/hypotheses")
class HypothesisController(private val hypothesisService: HypothesisService) {

    @ApiOperation(value = "Find all")
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    fun findAll(
        @RequestHeader("x-application-id") applicationId: String,
        pageable: Pageable
    ): ResourcePageRepresentation<HypothesisRepresentation> =
        this.hypothesisService.findAll(applicationId, pageable).toResourcePageRepresentation()

    @ApiOperation(value = "Find by id")
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun findById(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable id: String
    ): HypothesisRepresentation =
        this.hypothesisService.findHypothesisById(id, applicationId)

    @ApiOperation(value = "Create Hypothesis")
    @ApiImplicitParam(name = "request", value = "Create Hypothesis", required = true, dataType = "CreateHypothesisRequest")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(
        @RequestHeader("x-application-id") applicationId: String,
        @Valid @RequestBody request: CreateHypothesisRequest
    ): HypothesisRepresentation =
        this.hypothesisService.create(request, applicationId)

    @ApiOperation(value = "Update Hypothesis")
    @ApiImplicitParam(name = "request", value = "Update Hypothesis", required = true, dataType = "UpdateHypothesisRequest")
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun update(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable id: String,
        @Valid @RequestBody request: UpdateHypothesisRequest
    ): HypothesisRepresentation =
        this.hypothesisService.update(id, request, applicationId)

    @ApiOperation(value = "Delete by id")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable id: String
    ) {
        this.hypothesisService.delete(id, applicationId)
    }

    @ApiOperation(value = "Add labels")
    @PostMapping("/{id}/labels")
    @ResponseStatus(HttpStatus.OK)
    fun addLabels(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable id: String,
        @RequestBody labelIds: List<String>
    ): HypothesisRepresentation {
        return this.hypothesisService.addLabels(id, labelIds, applicationId)
    }

    @ApiOperation(value = "Remove labels")
    @DeleteMapping("/{id}/labels/{labelId}")
    @ResponseStatus(HttpStatus.OK)
    fun removeLabel(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable id: String, @PathVariable labelId: String
    ) {
        this.hypothesisService.removeLabel(id, labelId, applicationId)
    }

    @ApiOperation(value = "Add circles")
    @PostMapping("/{id}/circles")
    @ResponseStatus(HttpStatus.OK)
    fun addCircles(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable id: String,
        @RequestBody circleIds: List<String>
    ): HypothesisRepresentation {
        return this.hypothesisService.addCircles(id, circleIds, applicationId)
    }

    @ApiOperation(value = "Remove circles")
    @DeleteMapping("/{id}/circles/{circleId}")
    @ResponseStatus(HttpStatus.OK)
    fun removeCircle(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable id: String,
        @PathVariable circleId: String
    ) {
        this.hypothesisService.removeCircle(id, circleId, applicationId)
    }

    @ApiOperation(value = "Get board")
    @GetMapping("/{id}/board")
    @ResponseStatus(HttpStatus.OK)
    fun getBoard(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable id: String
    ): HypothesisBoardRepresentation {
        return this.hypothesisService.getBoard(id, applicationId)
    }

    @ApiOperation(value = "Order cards in column")
    @PatchMapping("/{id}/cards")
    @ResponseStatus(HttpStatus.OK)
    fun orderCardsInColumn(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable id: String,
        @RequestBody request: OrderCardInColumnRequest
    ): List<CardsByColumnsRepresentation> {
        return this.hypothesisService.orderCardsInColumn(id, request, applicationId)
    }

    @ApiOperation(value = "Update cards column")
    @PatchMapping("/{id}/cards/{cardId}/column")
    @ResponseStatus(HttpStatus.OK)
    fun updateCardColumn(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable id: String,
        @PathVariable cardId: String,
        @RequestBody request: UpdateCardColumnRequest
    ): List<CardsByColumnsRepresentation> =
        this.hypothesisService.updateCardColumn(id, cardId, request, applicationId)

    @ApiOperation(value = "Find Hypothesis Deployments Per Circle")
    @GetMapping("/{id}/deployments")
    @ResponseStatus(HttpStatus.OK)
    fun findHypothesisDeploymentsPerCircle(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable id: String
    ): List<CircleDeploymentsRepresentation> {
        return this.hypothesisService.findHypothesisDeploymentsPerCircle(id, applicationId)
    }

    @ApiOperation(value = "Find Hypothesis Validated Build")
    @GetMapping("/{id}/builds/validated")
    @ResponseStatus(HttpStatus.OK)
    fun findHypothesisValidatedBuilds(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable id: String
    ): List<SimpleBuildRepresentation> {
        return this.hypothesisService.findValidatedBuildsByHypothesisId(id, applicationId)
    }

    @ApiOperation(value = "Find Event Status")
    @GetMapping("/{id}/events/status")
    @ResponseStatus(HttpStatus.OK)
    fun findEventsStatus(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable id: String
    ) = this.hypothesisService.getBoardActiveEvents(id, applicationId)

}
