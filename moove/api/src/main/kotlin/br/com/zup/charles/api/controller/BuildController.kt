/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.api.controller

import br.com.zup.charles.application.build.*
import br.com.zup.charles.application.build.request.BuildCallbackRequest
import br.com.zup.charles.application.build.request.CreateBuildRequest
import br.com.zup.charles.application.build.request.CreateComposedBuildRequest
import br.com.zup.charles.application.build.response.BuildResponse
import br.com.zup.charles.application.build.response.ResourcePageResponse
import br.com.zup.charles.domain.BuildStatusEnum
import br.com.zup.charles.domain.PageRequest
import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiOperation
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

@Api(value = "Build Endpoints", tags = ["Build"])
@RestController
@RequestMapping("/v2/builds")
class BuildController(
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
        @RequestHeader("x-application-id") applicationId: String,
        @Valid @RequestBody request: CreateBuildRequest
    ): BuildResponse {
        return this.createBuildInteractor.execute(request, applicationId)
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
        @RequestHeader("x-application-id") applicationId: String,
        @Valid @RequestBody
        request: CreateComposedBuildRequest
    ): BuildResponse {
        return this.createComposedBuildInteractor.execute(request, applicationId)
    }

    @ApiOperation(value = "Find Build By Id")
    @GetMapping("/{id}")
    fun findBuildById(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable("id") id: String
    ): BuildResponse {
        return this.findBuildByIdInteractor.execute(id, applicationId)
    }

    @ApiOperation(value = "Find all Builds")
    @GetMapping
    fun findAllBuilds(
        @RequestHeader("x-application-id") applicationId: String,
        @RequestParam(required = false, name = "tagName") tagName: String?,
        @RequestParam(required = false, name = "status") status: BuildStatusEnum?,
        pageable: PageRequest
    ): ResourcePageResponse<BuildResponse> {
        return this.findAllBuildsInteractor.execute(tagName, status, applicationId, pageable)
    }

    @ApiOperation(value = "Delete Build By Id")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    fun deleteBuildById(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable("id") id: String
    ) {
        this.deleteBuildByIdInteractor.execute(id, applicationId)
    }

    @ApiOperation(value = "Archive Build")
    @PatchMapping("/{id}/archive")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun archiveBuild(@RequestHeader("x-application-id") applicationId: String, @PathVariable("id") id: String) {
        this.archiveBuildInteractor.execute(id, applicationId)
    }

    @ApiOperation(value = "Build Callback")
    @PostMapping("/{id}/callback")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun buildCallback(@PathVariable("id") id: String, @RequestBody @Valid request: BuildCallbackRequest) {
        this.buildCallbackInteractor.execute(id, request)
    }
}