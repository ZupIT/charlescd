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
import io.charlescd.moove.application.usergroup.*
import io.charlescd.moove.application.usergroup.request.AddMemberToUserGroupRequest
import io.charlescd.moove.application.usergroup.request.CreateUserGroupRequest
import io.charlescd.moove.application.usergroup.request.UpdateUserGroupRequest
import io.charlescd.moove.application.usergroup.response.UserGroupResponse
import io.charlescd.moove.domain.PageRequest
import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiOperation
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

@Api(value = "User Group Endpoints", tags = ["User Group"])
@RestController
@RequestMapping("/v2/user-groups")
class V2UserGroupController(
    private val createUserGroupInteractor: CreateUserGroupInteractor,
    private val updateUserGroupInteractor: UpdateUserGroupInteractor,
    private val findUserGroupByIdInteractor: FindUserGroupByIdInteractor,
    private val findAllUserGroupsInteractor: FindAllUserGroupsInteractor,
    private val deleteUserGroupByIdInteractor: DeleteUserGroupByIdInteractor,
    private val addMemberToUserGroupInteractor: AddMemberToUserGroupInteractor,
    private val removeMemberFromUserGroupInteractor: RemoveMemberFromUserGroupInteractor
) {

    @ApiOperation(value = "Create a new User Group")
    @ApiImplicitParam(name = "request", value = "User Group Details", required = true, dataType = "CreateUserGroupRequest")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@Valid @RequestBody request: CreateUserGroupRequest): UserGroupResponse {
        return this.createUserGroupInteractor.execute(request)
    }

    @ApiOperation(value = "Update a existing User Group")
    @ApiImplicitParam(name = "request", value = "User Group Details", required = true, dataType = "UpdateUserGroupRequest")
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun update(@PathVariable id: String, @Valid @RequestBody request: UpdateUserGroupRequest): UserGroupResponse {
        return this.updateUserGroupInteractor.execute(id, request)
    }

    @ApiOperation(value = "Find User Group By Id")
    @ApiImplicitParam(name = "id", value = "User Group Id", required = true, dataType = "string", paramType = "path")
    @GetMapping("/{id}")
    fun findById(@PathVariable("id") id: String): UserGroupResponse {
        return this.findUserGroupByIdInteractor.execute(id)
    }

    @ApiOperation(value = "Find all User Groups")
    @GetMapping
    fun findAll(pageable: PageRequest): ResourcePageResponse<UserGroupResponse> {
        return this.findAllUserGroupsInteractor.execute(pageable)
    }

    @ApiOperation(value = "Delete User Group By Id")
    @ApiImplicitParam(name = "id", value = "User Group Id", required = true, dataType = "string", paramType = "path")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    fun delete(@PathVariable("id") id: String) {
        this.deleteUserGroupByIdInteractor.execute(id)
    }

    @ApiOperation(value = "Add member to a User Group")
    @ApiImplicitParam(name = "request", value = "Add Member to User Group Details", required = true, dataType = "AddMemberUserGroupRequest")
    @PostMapping("/{id}/members")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun addMemberToUserGroup(@PathVariable id: String, @Valid @RequestBody request: AddMemberToUserGroupRequest) {
        this.addMemberToUserGroupInteractor.execute(id, request)
    }

    @ApiOperation(value = "Delete member from a User Group")
    @ApiImplicitParam(name = "id", value = "User Group Id", required = true, dataType = "string", paramType = "path")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}/members/{memberId}")
    fun delete(@PathVariable("id") id: String, @PathVariable("memberId") memberId: String) {
        this.removeMemberFromUserGroupInteractor.execute(id, memberId)
    }

}
