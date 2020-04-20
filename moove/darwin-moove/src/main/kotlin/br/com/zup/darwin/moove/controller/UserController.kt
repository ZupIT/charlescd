/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.controller

import br.com.zup.darwin.commons.extension.toResourcePageRepresentation
import br.com.zup.darwin.commons.representation.GroupsRepresentation
import br.com.zup.darwin.commons.representation.ResourcePageRepresentation
import br.com.zup.darwin.commons.representation.UserRepresentation
import br.com.zup.darwin.moove.request.user.AddGroupsRequest
import br.com.zup.darwin.moove.request.user.CreateUserRequest
import br.com.zup.darwin.moove.request.user.ResetPasswordRequest
import br.com.zup.darwin.moove.request.user.UpdateUserRequest
import br.com.zup.darwin.moove.service.KeycloakService
import br.com.zup.darwin.moove.service.UserService
import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiOperation
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

@Api(value = "User Endpoints", tags = ["User"])
@RestController
@RequestMapping("/users")
class UserController(
    private val userService: UserService,
    private val keycloakService: KeycloakService
) {
    @ApiOperation(value = "Find all")
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    fun findAll(pageable: Pageable): ResourcePageRepresentation<UserRepresentation> =
        userService.findAll(pageable).toResourcePageRepresentation()

    @ApiOperation(value = "Find by email")
    @GetMapping("/{email:.+}")
    @ResponseStatus(HttpStatus.OK)
    fun findByEmail(@PathVariable email: String): UserRepresentation =
        userService.findByEmail(email)

    @ApiOperation(value = "Find user groups")
    @GetMapping("/{id}/groups")
    @ResponseStatus(HttpStatus.OK)
    fun findUserGroups(@PathVariable id: String): GroupsRepresentation = keycloakService.findUserGroups(id)

    @ApiOperation(value = "Create User")
    @ApiImplicitParam(name = "createUserRequest", value = "Create User", required = true, dataType = "CreateUserRequest")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@Valid @RequestBody createUserRequest: CreateUserRequest): UserRepresentation =
        userService.create(createUserRequest)

    @ApiOperation(value = "Update User")
    @ApiImplicitParam(name = "updateUserRequest", value = "Update User", required = true, dataType = "UpdateUserRequest")
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun update(@PathVariable id: String, @Valid @RequestBody updateUserRequest: UpdateUserRequest) {
        userService.update(id, updateUserRequest)
    }

    @ApiOperation(value = "Delete by id")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable id: String) {
        userService.delete(id)
    }

    @ApiOperation(value = "Reset password")
    @PutMapping("/{email}/reset-password")
    @ResponseStatus(HttpStatus.OK)
    fun resetPassword(@PathVariable email: String, @RequestBody request: ResetPasswordRequest) =
        userService.resetPassword(email, request)

    @ApiOperation(value = "Add groups")
    @ApiImplicitParam(name = "addGroupsRequest", value = "Add groups", required = true, dataType = "AddGroupsRequest")
    @PostMapping("/{id}/groups")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun addGroups(@PathVariable id: String, @Valid @RequestBody addGroupsRequest: AddGroupsRequest) {
        userService.addGroupsToUser(id, addGroupsRequest)
    }

    @ApiOperation(value = "Remove user from group")
    @DeleteMapping("/{userId}/groups/{groupId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun removeUserFromGroup(@PathVariable userId: String, @PathVariable groupId: String) {
        userService.removeUserFromGroup(userId, groupId)
    }

}