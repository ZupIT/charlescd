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

package io.charlescd.moove.legacy.moove.controller

import io.charlescd.moove.legacy.moove.request.group.CreateGroupRequest
import io.charlescd.moove.legacy.moove.request.group.UpdateGroupRequest
import io.charlescd.moove.legacy.moove.request.role.CreateRoleRequest
import io.charlescd.moove.legacy.moove.service.KeycloakService
import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiOperation
import javax.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@Api(value = "Auth Info Endpoints", tags = ["Auth Info"])
@RestController
@RequestMapping("/auth/info")
class AuthInfoController(private val keycloakService: KeycloakService) {

    @ApiOperation(value = "Find Roles")
    @GetMapping("/roles")
    @ResponseStatus(HttpStatus.OK)
    fun findAllRoles() = keycloakService.findAllRoles()

    @ApiOperation(value = "Create Roles")
    @ApiImplicitParam(
        name = "createRoleRequest",
        value = "Create Roles",
        required = true,
        dataType = "CreateRoleRequest"
    )
    @PostMapping("/roles")
    @ResponseStatus(HttpStatus.CREATED)
    fun createRole(@Valid @RequestBody createRoleRequest: CreateRoleRequest) =
        keycloakService.createRole(createRoleRequest)

    @ApiOperation(value = "Delete Roles")
    @DeleteMapping("/roles/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteRoleById(@PathVariable id: String) = keycloakService.deleteRoleById(id)

    @ApiOperation(value = "Find all Groups")
    @GetMapping("/groups")
    @ResponseStatus(HttpStatus.OK)
    fun findAllGroups() = keycloakService.findAllGroups()

    @ApiOperation(value = "Create Groups")
    @ApiImplicitParam(
        name = "createGroupRequest",
        value = "Create Groups",
        required = true,
        dataType = "CreateGroupRequest"
    )
    @PostMapping("/groups")
    @ResponseStatus(HttpStatus.CREATED)
    fun createGroup(@Valid @RequestBody createGroupRequest: CreateGroupRequest) =
        keycloakService.createGroup(createGroupRequest)

    @ApiOperation(value = "Update Groups")
    @ApiImplicitParam(
        name = "updateGroupRequest",
        value = "Update Groups",
        required = true,
        dataType = "UpdateGroupRequest"
    )
    @PutMapping("/groups/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun updateGroup(@PathVariable id: String, @Valid @RequestBody updateGroupRequest: UpdateGroupRequest) =
        keycloakService.updateGroup(id, updateGroupRequest)

    @ApiOperation(value = "Find group by id")
    @GetMapping("/groups/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun findGroupById(@PathVariable id: String) = keycloakService.findGroupById(groupId = id)

    @ApiOperation(value = "Delete group by id")
    @DeleteMapping("/groups/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteGroupById(@PathVariable id: String) = keycloakService.deleteGroupById(id)

    @ApiOperation(value = "Find group roles by id")
    @GetMapping("/groups/{id}/roles")
    @ResponseStatus(HttpStatus.OK)
    fun findGroupRolesById(@PathVariable id: String) = keycloakService.findGroupRolesById(groupId = id)
}
