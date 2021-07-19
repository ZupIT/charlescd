/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.charlescd.moove.api.controller

import io.charlescd.moove.application.ResourcePageResponse
import io.charlescd.moove.application.circle.*
import io.charlescd.moove.application.circle.request.CreateCircleRequest
import io.charlescd.moove.application.circle.request.CreateCircleWithCsvRequest
import io.charlescd.moove.application.circle.request.CreateCircleWithPercentageRequest
import io.charlescd.moove.application.circle.request.PatchCirclePercentageRequest
import io.charlescd.moove.application.circle.request.PatchCircleRequest
import io.charlescd.moove.application.circle.request.UpdateCircleWithCsvRequest
import io.charlescd.moove.application.circle.response.*
import io.charlescd.moove.domain.PageRequest
import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiOperation
import javax.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@Api(value = "Circle v2 Endpoints", tags = ["Circles"])
@RestController
@RequestMapping("/v2/circles")
class V2CircleController(
    private val createCircleInteractor: CreateCircleInteractor,
    private val patchCircleInteractor: PatchCircleInteractor,
    private val patchCirclePercentageInteractor: PatchCircleWithPercentageInteractor,
    private val findCircleByIdInteractor: FindCircleByIdInteractor,
    private val deleteCircleByIdInteractor: DeleteCircleByIdInteractor,
    private val findAllCirclesInteractor: FindAllCirclesInteractor,
    private val findAllCirclesSimpleInteractor: FindAllCirclesSimpleInteractor,
    private val findAllCirclesPercentageInteractor: FindCirclesPercentageInteractor,
    private val findCircleComponentsInteractor: FindCircleComponentsInteractor,
    private val createCircleWithCsvFileInteractor: CreateCircleWithCsvFileInteractor,
    private val updateCircleWithCsvFileInteractor: UpdateCircleWithCsvFileInteractor,
    private val identifyCircleInteractor: IdentifyCircleInteractor,
    private val circlesHistoryInteractor: FindCirclesHistoryInteractor,
    private val createCircleWIthPercentageInteractor: CreateCircleWithPercentageInteractor
) {

    @ApiOperation(value = "Find all")
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    fun find(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @RequestParam(name = "name", required = false) name: String?,
        @RequestParam(name = "active", required = false) active: Boolean?,
        @Valid pageRequest: PageRequest
    ): ResourcePageResponse<CircleResponse> {
        return this.findAllCirclesInteractor.execute(name, active, workspaceId, pageRequest)
    }

    @ApiOperation(value = "Find all simplifyed")
    @GetMapping(path = ["/simple"])
    @ResponseStatus(HttpStatus.OK)
    fun findSimplyfied(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @RequestParam(name = "name", required = false) name: String?,
        @RequestParam(name = "except", required = false) except: String?,
        @RequestParam(name = "active", required = false) active: Boolean?,
        @Valid pageRequest: PageRequest
    ): ResourcePageResponse<SimpleCircleResponse> {
        return this.findAllCirclesSimpleInteractor.execute(name, except, active, workspaceId, pageRequest)
    }

    @ApiOperation(value = "Find Circle by Id")
    @GetMapping(path = ["/{id}"])
    @ResponseStatus(HttpStatus.OK)
    fun findCircleById(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable("id") id: String
    ): CircleResponse {
        return this.findCircleByIdInteractor.execute(id, workspaceId)
    }

    @ApiOperation(value = "Find Circle current deployed Components by Id")
    @GetMapping(path = ["/{id}/components"])
    @ResponseStatus(HttpStatus.OK)
    fun findCircleComponents(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable("id") id: String
    ): List<CircleComponentResponse> {
        return this.findCircleComponentsInteractor.execute(id, workspaceId)
    }

    @ApiOperation(value = "Create a new Circle")
    @ApiImplicitParam(name = "request", value = "Circle Details", required = true, dataType = "CreateCircleRequest")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createCircle(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @RequestHeader(value = "Authorization", required = false) authorization: String?,
        @RequestHeader(value = "x-charles-token", required = false) token: String?,
        @Valid @RequestBody request: CreateCircleRequest
    ): CircleResponse {
        return this.createCircleInteractor.execute(request, workspaceId, authorization, token)
    }

    @ApiOperation(value = "Patch Circle")
    @ApiImplicitParam(name = "request", value = "Circle Details", required = true, dataType = "PatchCircleRequest")
    @PatchMapping(path = ["/{id}"])
    @ResponseStatus(HttpStatus.OK)
    fun patchCircle(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable(name = "id") id: String,
        @RequestBody @Valid request: PatchCircleRequest
    ): CircleResponse {
        return this.patchCircleInteractor.execute(id, request, workspaceId)
    }

    @ApiOperation(value = "Delete Circle")
    @DeleteMapping(path = ["/{id}"])
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteCircle(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable(name = "id") id: String
    ) {
        this.deleteCircleByIdInteractor.execute(id, workspaceId)
    }

    @ApiOperation(value = "Create circle with CSV")
    @PostMapping("/csv", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    @ResponseStatus(HttpStatus.CREATED)
    fun createWithCsv(
        @RequestHeader(value = "Authorization", required = false) authorization: String,
        @RequestHeader(value = "x-charles-token", required = false) token: String,
        @RequestHeader("x-workspace-id") workspaceId: String,
        @RequestParam("name") name: String,
        @RequestParam("keyName") keyName: String,
        @RequestParam("file") file: MultipartFile
    ): CircleResponse {
        return this.createCircleWithCsvFileInteractor.execute(
            CreateCircleWithCsvRequest(
                name,
                keyName,
                file.inputStream
            ), workspaceId,
            authorization,
            token
        )
    }

    @ApiOperation(value = "Update circle with CSV")
    @PutMapping("/{id}/csv", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    @ResponseStatus(HttpStatus.OK)
    fun updateWithCsv(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable("id") id: String,
        @RequestParam("name") name: String,
        @RequestParam("keyName", required = false) keyName: String?,
        @RequestParam("file", required = false) file: MultipartFile?
    ): CircleResponse {
        return updateCircleWithCsvFileInteractor.execute(
            UpdateCircleWithCsvRequest(
                id,
                name,
                keyName,
                file?.inputStream
            ), workspaceId
        )
    }

    @ApiOperation(value = "Identify Circles by WorkspaceId")
    @ApiImplicitParam(
        name = "request",
        value = "Identification Data",
        required = true,
        dataType = "Map"
    )
    @PostMapping(path = ["/identify"])
    @ResponseStatus(HttpStatus.OK)
    fun identify(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @Valid @RequestBody request: Map<String, Any>
    ): List<IdentifyCircleResponse> {
        return identifyCircleInteractor.execute(workspaceId, request)
    }

    @ApiOperation(value = "Find circle history")
    @GetMapping(path = ["/history"])
    @ResponseStatus(HttpStatus.OK)
    fun getHistory(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @RequestParam(value = "name", required = false) name: String?,
        pageRequest: PageRequest
    ): ResourcePageResponse<CircleHistoryResponse> {
        return circlesHistoryInteractor.execute(workspaceId, name, pageRequest)
    }

    @ApiOperation(value = "Create circle with Percentage")
    @PostMapping("/percentage")
    @ApiImplicitParam(name = "request", value = "Circle Details", required = true, dataType = "CreateCirclePercentageRequest")
    @ResponseStatus(HttpStatus.CREATED)
    fun createWithPercentage(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @Valid @RequestBody request: CreateCircleWithPercentageRequest
    ): CircleResponse {
        return this.createCircleWIthPercentageInteractor.execute(
            request,
            workspaceId
        )
    }

    @ApiOperation(value = "Patch percentage circle")
    @ApiImplicitParam(name = "request", value = "Circle Details", required = true, dataType = "PatchCirclePercentageRequest")
    @PatchMapping(path = ["/{id}/percentage"])
    @ResponseStatus(HttpStatus.OK)
    fun patchCirclePercentage(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable(name = "id") id: String,
        @RequestBody @Valid request: PatchCirclePercentageRequest
    ): CircleResponse {
        return this.patchCirclePercentageInteractor.execute(id, request)
    }

    @ApiOperation(value = "Find all Percentage")
    @GetMapping("/percentage")
    @ResponseStatus(HttpStatus.OK)
    fun findPercentage(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @RequestParam(name = "name", required = false) name: String?,
        @RequestParam(name = "active", required = true) active: Boolean,
        pageRequest: PageRequest
    ): ResourcePageResponse<CirclePercentageResponse> {
        return this.findAllCirclesPercentageInteractor.execute(workspaceId, name, active, pageRequest)
    }
}
