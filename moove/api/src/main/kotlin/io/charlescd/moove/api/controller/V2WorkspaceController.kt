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
import io.charlescd.moove.application.user.response.UserResponse
import io.charlescd.moove.application.workspace.*
import io.charlescd.moove.application.workspace.request.AssociateUserGroupToWorkspaceRequest
import io.charlescd.moove.application.workspace.request.CreateWorkspaceRequest
import io.charlescd.moove.application.workspace.request.PatchWorkspaceRequest
import io.charlescd.moove.application.workspace.response.WorkspaceResponse
import io.charlescd.moove.domain.PageRequest
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiOperation
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

@RestController
@RequestMapping("/v2/workspaces")
class V2WorkspaceController(
    private val createWorkspaceInteractor: CreateWorkspaceInteractor,
    private val associateUserGroupInteractor: AssociateUserGroupToWorkspaceInteractor,
    private val disassociateUserGroupInteractor: DisassociateUserGroupFromWorkspaceInteractor,
    private val patchWorkspaceInteractor: PatchWorkspaceInteractor,
    private val findWorkspaceInteractor: FindWorkspaceInteractor,
    private val findAllWorkspacesInteractor: FindAllWorkspaceInteractor,
    private val findAllWorkspaceUsersInteractor: FindAllWorkspaceUsersInteractor
) {

    @ApiOperation(value = "Create a new Workspace")
    @ApiImplicitParam(
        name = "request",
        value = "Workspace Information",
        required = true,
        dataType = "CreateWorkspaceRequest"
    )
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createWorkspace(@Valid @RequestBody request: CreateWorkspaceRequest): WorkspaceResponse {
        return createWorkspaceInteractor.execute(request)
    }

    @ApiOperation(value = "Patch Workspace")
    @ApiImplicitParam(
        name = "request",
        value = "Patch Workspace Information",
        required = true,
        dataType = "PatchWorkspaceRequest"
    )
    @PatchMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun patchWorkspace(
        @PathVariable id: String,
        @Valid @RequestBody request: PatchWorkspaceRequest
    ) {
        return patchWorkspaceInteractor.execute(id, request)
    }

    @ApiOperation(value = "Find all workspaces")
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    fun findAll(
        pageRequest: PageRequest,
        @RequestParam(required = false, name = "name") name: String?
    ): ResourcePageResponse<WorkspaceResponse> {
        return findAllWorkspacesInteractor.execute(pageRequest, name)
    }

    @ApiOperation(value = "Find Workspace Information")
    @ApiImplicitParam(
        name = "id",
        value = "Workspace Id",
        required = true,
        dataType = "string",
        paramType = "path"
    )
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun findWorkspace(@PathVariable id: String): WorkspaceResponse {
        return findWorkspaceInteractor.execute(id)
    }

    @ApiOperation(value = "Associate a user group to a Workspace")
    @ApiImplicitParam(
        name = "request",
        value = "Workspace Information",
        required = true,
        dataType = "CreateWorkspaceRequest"
    )
    @PostMapping("/{workspaceId}/groups")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun associateUserGroup(@PathVariable workspaceId: String, @Valid @RequestBody request: AssociateUserGroupToWorkspaceRequest) {
        return associateUserGroupInteractor.execute(workspaceId, request)
    }

    @ApiOperation(value = "Disassociate a user group from a Workspace")
    @DeleteMapping("/{workspaceId}/groups/{userGroupId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun disassociateUserGroup(@PathVariable workspaceId: String, @PathVariable userGroupId: String) {
        return disassociateUserGroupInteractor.execute(workspaceId, userGroupId)
    }

    @ApiOperation(value = "Find all Users associated to the given Workspace")
    @GetMapping("/users")
    fun findAllWorkspaceUsers(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @RequestParam("name", required = false) name: String?,
        @RequestParam("email", required = false) email: String?,
        pageable: PageRequest
    ): ResourcePageResponse<UserResponse> {
        return this.findAllWorkspaceUsersInteractor.execute(workspaceId, name, email, pageable)
    }

}
