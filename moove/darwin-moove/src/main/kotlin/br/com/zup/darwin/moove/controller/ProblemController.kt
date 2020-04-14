/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.controller

import br.com.zup.darwin.commons.representation.ProblemRepresentation
import br.com.zup.darwin.moove.request.problem.CreateProblemRequest
import br.com.zup.darwin.moove.request.problem.UpdateProblemRequest
import br.com.zup.darwin.moove.service.ProblemService
import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiOperation
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

@Api(value = "Problem Endpoints", tags = ["Problem"])
@RestController
@RequestMapping("/problems")
class ProblemController(private val problemService: ProblemService) {

    @ApiOperation(value = "Create Problem")
    @ApiImplicitParam(name = "createProblemRequest", value = "Create Problem", required = true, dataType = "CreateProblemRequest")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(
        @RequestHeader("x-application-id") applicationId: String,
        @Valid @RequestBody createProblemRequest: CreateProblemRequest
    ): ProblemRepresentation {
        return this.problemService.create(createProblemRequest, applicationId)
    }

    @ApiOperation(value = "Find by id")
    @GetMapping(path = ["/{id}"])
    @ResponseStatus(HttpStatus.OK)
    fun findById(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable("id") id: String
    ) = this.problemService.findById(id, applicationId)

    @ApiOperation(value = "Find all")
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    fun findAll(
        @RequestHeader("x-application-id") applicationId: String,
        pageable: Pageable
    ) = this.problemService.findAll(applicationId, pageable)


    @ApiOperation(value = "Update by id")
    @ApiImplicitParam(name = "updateProblemRequest", value = "Update by id", required = true, dataType = "UpdateProblemRequest")
    @PutMapping(path = ["/{id}"])
    @ResponseStatus(HttpStatus.OK)
    fun updateById(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable("id") id: String,
        @Valid @RequestBody updateProblemRequest: UpdateProblemRequest
    ) = this.problemService.updateById(id, updateProblemRequest, applicationId)

    @ApiOperation(value = "Delete by id")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping(path = ["/{id}"])
    fun deleteById(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable("id") id: String
    ) = this.problemService.deleteById(id, applicationId)

}