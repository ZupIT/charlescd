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
import io.charlescd.moove.application.build.*
import io.charlescd.moove.application.build.request.BuildCallbackRequest
import io.charlescd.moove.application.build.request.CreateBuildRequest
import io.charlescd.moove.application.build.request.CreateComposedBuildRequest
import io.charlescd.moove.application.build.response.BuildResponse
import io.charlescd.moove.domain.BuildStatusEnum
import io.charlescd.moove.domain.PageRequest
import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiOperation
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

@Api(value = "Build Endpoints", tags = ["Build"])
@RestController
@RequestMapping("/v2/builds")
class V2BuildController(
    private val archiveBuildInteractor: ArchiveBuildInteractor,
    private val createBuildInteractor: CreateBuildInteractor,
    private val createComposedBuildInteractor: CreateComposedBuildInteractor,
    private val deleteBuildByIdInteractor: DeleteBuildByIdInteractor,
    private val findAllBuildsInteractor: FindAllBuildsInteractor,
    private val findBuildByIdInteractor: FindBuildByIdInteractor,
    private val buildCallbackInteractor: BuildCallbackInteractor
) {

    @ApiOperation(value = "Create a new Build")
    @ApiImplicitParam(name = "request", value = "Build Details", required = true, dataType = "CreateBuildRequest")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createBuild(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @Valid @RequestBody request: CreateBuildRequest
    ): BuildResponse {
        return this.createBuildInteractor.execute(request, workspaceId)
    }

    @ApiOperation(value = "Create a new Compose Build")
    @ApiImplicitParam(
        name = "request",
        value = "Build Compose Details",
        required = true,
        dataType = "CreateComposedBuildRequest"
    )
    @PostMapping("/compose")
    @ResponseStatus(HttpStatus.CREATED)
    fun createComposedBuild(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @Valid @RequestBody
        request: CreateComposedBuildRequest
    ): BuildResponse {
        return this.createComposedBuildInteractor.execute(request, workspaceId)
    }

    @ApiOperation(value = "Find Build By Id")
    @GetMapping("/{id}")
    fun findBuildById(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable("id") id: String
    ): BuildResponse {
        return this.findBuildByIdInteractor.execute(id, workspaceId)
    }

    @ApiOperation(value = "Find all Builds")
    @GetMapping
    fun findAllBuilds(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @RequestParam(required = false, name = "tagName") tagName: String?,
        @RequestParam(required = false, name = "status") status: BuildStatusEnum?,
        pageRequest: PageRequest
    ): ResourcePageResponse<BuildResponse> {
        return this.findAllBuildsInteractor.execute(tagName, status, workspaceId, pageRequest)
    }

    @ApiOperation(value = "Delete Build By Id")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    fun deleteBuildById(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable("id") id: String
    ) {
        this.deleteBuildByIdInteractor.execute(id, workspaceId)
    }

    @ApiOperation(value = "Archive Build")
    @PatchMapping("/{id}/archive")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun archiveBuild(@RequestHeader("x-workspace-id") workspaceId: String, @PathVariable("id") id: String) {
        this.archiveBuildInteractor.execute(id, workspaceId)
    }

    @ApiOperation(value = "Build Callback")
    @PostMapping("/{id}/callback")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun buildCallback(@PathVariable("id") id: String, @RequestBody @Valid request: BuildCallbackRequest) {
        this.buildCallbackInteractor.execute(id, request)
    }
}
