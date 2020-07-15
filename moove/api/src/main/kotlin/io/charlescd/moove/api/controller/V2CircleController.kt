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
import io.charlescd.moove.application.circle.request.PatchCircleRequest
import io.charlescd.moove.application.circle.request.UpdateCircleWithCsvRequest
import io.charlescd.moove.application.circle.response.CircleComponentResponse
import io.charlescd.moove.application.circle.response.CircleHistoryResponse
import io.charlescd.moove.application.circle.response.CircleResponse
import io.charlescd.moove.application.circle.response.IdentifyCircleResponse
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
    private val findCircleByIdInteractor: FindCircleByIdInteractor,
    private val deleteCircleByIdInteractor: DeleteCircleByIdInteractor,
    private val findAllCirclesInteractor: FindAllCirclesInteractor,
    private val findCircleComponentsInteractor: FindCircleComponentsInteractor,
    private val createCircleWithCsvFileInteractor: CreateCircleWithCsvFileInteractor,
    private val updateCircleWithCsvFileInteractor: UpdateCircleWithCsvFileInteractor,
    private val identifyCircleInteractor: IdentifyCircleInteractor,
    private val circlesHistoryInteractor: FindCirclesHistoryInteractor
) {

    @ApiOperation(value = "Find all")
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    fun find(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @RequestParam(name = "name", required = false) name: String?,
        @RequestParam(name = "active", required = true) active: Boolean,
        pageRequest: PageRequest
    ): ResourcePageResponse<CircleResponse> {
        return this.findAllCirclesInteractor.execute(name, active, workspaceId, pageRequest)
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
        @Valid @RequestBody request: CreateCircleRequest
    ): CircleResponse {
        return this.createCircleInteractor.execute(request, workspaceId)
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
        return this.patchCircleInteractor.execute(id, request)
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
        @RequestHeader("x-workspace-id") workspaceId: String,
        @RequestParam("name") name: String,
        @RequestParam("authorId") authorId: String,
        @RequestParam("keyName") keyName: String,
        @RequestParam("file") file: MultipartFile
    ): CircleResponse {
        return this.createCircleWithCsvFileInteractor.execute(
            CreateCircleWithCsvRequest(
                name,
                authorId,
                keyName,
                file.inputStream
            ), workspaceId
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

    @ApiOperation(value = "Identify Circles by WorkspaceId")
    @PostMapping(path = ["/history"])
    @ResponseStatus(HttpStatus.OK)
    fun getHistory(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @RequestParam(value = "name", required = false) name: String?,
        pageRequest: PageRequest
    ): CircleHistoryResponse {
        return circlesHistoryInteractor.execute(workspaceId, name, pageRequest)
    }
}
