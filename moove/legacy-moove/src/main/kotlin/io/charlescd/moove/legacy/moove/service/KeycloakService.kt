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

package io.charlescd.moove.legacy.moove.service

import io.charlescd.moove.commons.exceptions.NotFoundExceptionLegacy
import io.charlescd.moove.commons.representation.*
import io.charlescd.moove.legacy.moove.request.group.CreateGroupRequest
import io.charlescd.moove.legacy.moove.request.group.UpdateGroupRequest
import io.charlescd.moove.legacy.moove.request.role.CreateRoleRequest
import io.charlescd.moove.legacy.repository.UserRepository
import java.time.LocalDateTime
import java.time.ZoneOffset
import org.keycloak.admin.client.Keycloak
import org.keycloak.admin.client.resource.GroupResource
import org.keycloak.representations.idm.CredentialRepresentation
import org.keycloak.representations.idm.GroupRepresentation as KeycloakGroupRepresentation
import org.keycloak.representations.idm.RoleRepresentation as KeycloakRoleRepresentation
import org.keycloak.representations.idm.UserRepresentation as KeycloakUserRepresentation
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class KeycloakService(private val keycloak: Keycloak, private val userRepository: UserRepository) {

    @Value("\${charlescd.keycloak.realm}")
    lateinit var realm: String

    fun findAllRoles(): List<RoleRepresentation> {
        return this.keycloak
            .realm(this.realm)
            .roles()
            .list()
            .map { RoleRepresentation(id = it.id, name = it.name, description = it.description) }
    }

    fun createRole(createRoleRequest: CreateRoleRequest): RoleRepresentation {
        this.keycloak
            .realm(this.realm)
            .roles()
            .create(createRoleRequest.toKeycloakRepresentation())

        return this.keycloak
            .realm(this.realm)
            .roles()
            .get(createRoleRequest.name)
            .toRepresentation()
            .let { RoleRepresentation(id = it.id, name = it.name, description = it.description) }
    }

    fun createGroup(createGroupRequest: CreateGroupRequest): GroupRepresentation {
        this.keycloak
            .realm(this.realm)
            .groups()
            .add(createGroupRequest.toKeycloakRepresentation())

        return findKeycloakGroupByPath(createGroupPath(createGroupRequest.name))
            .apply { assignRolesToGroup(this, createGroupRequest.roleIds) }
            .let { createGroupRepresentation(it) }
    }

    fun updateGroup(groupId: String, updateGroupRequest: UpdateGroupRequest): GroupRepresentation {
        this.keycloak
            .realm(this.realm)
            .groups()
            .group(groupId)
            .update(updateGroupRequest.toKeycloakRepresentation(groupId))

        return findKeycloakGroupByPath(createGroupPath(updateGroupRequest.name))
            .apply { assignRolesToGroup(this, updateGroupRequest.roleIds) }
            .let { createGroupRepresentation(it) }
    }

    fun findGroupById(groupId: String): GroupMembersRepresentation {
        return findKeycloakGroupById(groupId)
            .takeIf { it != null }
            ?.toRepresentation()
            ?.let { createGroupMembersRepresentation(it) }
            ?: throw NotFoundExceptionLegacy("group", groupId)
    }

    fun findGroupRolesById(groupId: String): List<RoleRepresentation> {
        return findGroupRoles(
            findKeycloakGroupById(groupId)
                .takeIf { it != null }
                ?.toRepresentation()
                ?: throw NotFoundExceptionLegacy("group", groupId)
        )
    }

    fun findAllGroups(): List<GroupRepresentation> {
        return this.keycloak
            .realm(this.realm)
            .groups()
            .groups()
            .filterNotNull()
            .map { createGroupRepresentation(it) }
            .toList()
    }

    fun findUserGroups(id: String) =
        userRepository.findById(id)
            .orElseThrow { NotFoundExceptionLegacy("group", id) }
            .let { findUserGroupsByUsername(it.email) }
            .let { GroupsRepresentation(it) }

    fun deleteRoleById(roleId: String) {
        this.keycloak
            .realm(this.realm)
            .rolesById()
            .deleteRole(roleId)
    }

    fun deleteGroupById(groupId: String) {
        this.keycloak
            .realm(this.realm)
            .groups()
            .group(groupId)
            .remove()
    }

    fun removeUserFromGroup(email: String, groupId: String) {
        this.keycloak
            .realm(this.realm)
            .users()
            .search(email)
            .map { removeUserFromKeycloakGroup(it.id, groupId) }
    }

    fun createUser(email: String, name: String, password: String, isRoot: Boolean) {
        this.keycloak
            .realm(this.realm)
            .users()
            .create(createUserRepresentation(email, name, password, isRoot))
            .takeIf { it.status == 201 }
            ?: throw RuntimeException("Could not create user on keycloak.")
    }

    fun addGroupsToUser(email: String, groupIds: List<String>) {

        val groups = groupIds.map {
            findKeycloakGroupById(it)
                ?.toRepresentation()
                ?: throw NotFoundExceptionLegacy("group", it)
        }

        this.findUserByEmail(email)
            .takeIf { it != null }
            ?.let { assignGroupsToUser(it, groups) }
            ?: throw NotFoundExceptionLegacy("user", email)
    }

    fun deleteUserByEmail(email: String) {
        findUserByEmail(email)
            .takeIf { it != null }
            ?.apply { deleteUserById(this.id) }
            ?: throw NotFoundExceptionLegacy("user", email)
    }

    fun resetPassword(email: String, password: String) {
        keycloak.realm(this.realm)
            .users()
            .search(email)
            .takeIf { it.isNotEmpty() }
            ?.let { doResetPassword(it.first(), password) }
            ?: throw NotFoundExceptionLegacy("user", email)
    }

    fun updateUserAttributes(email: String, workspaceIds: List<String>) {

        val user = keycloak.realm(this.realm)
            .users()
            .search(email)
            .takeIf { it.isNotEmpty() }
            ?.first()!!

        user.attributes = mapOf("workspaces" to workspaceIds)

        keycloak.realm(this.realm)
            .users()
            .get(user.id)
            .update(user)
    }

    private fun assignGroupsToUser(
        user: KeycloakUserRepresentation,
        groups: List<KeycloakGroupRepresentation>
    ) {
        groups.map {
            this.keycloak
                .realm(this.realm)
                .users()
                .get(user.id)
                .joinGroup(it.id)
        }
    }

    private fun removeUserFromKeycloakGroup(userId: String, groupId: String) {
        this.keycloak
            .realm(this.realm)
            .users()
            .get(userId)
            .leaveGroup(groupId)
    }

    private fun createUserRepresentation(
        email: String,
        name: String,
        password: String,
        isRoot: Boolean
    ): KeycloakUserRepresentation {
        val userRepresentation = KeycloakUserRepresentation()
        val names = name.split(" ")

        val credential = CredentialRepresentation()
        credential.type = "password"
        credential.value = password

        userRepresentation.isEmailVerified = true
        userRepresentation.isEnabled = true
        userRepresentation.firstName = names.first()

        if (names.size > 1) userRepresentation.lastName = names.last()

        userRepresentation.email = email
        userRepresentation.username = email
        userRepresentation.createdTimestamp = LocalDateTime.now().toInstant(ZoneOffset.UTC).toEpochMilli()
        userRepresentation.credentials = listOf(credential)
        userRepresentation.singleAttribute("isRoot", isRoot.toString())

        return userRepresentation
    }

    private fun doResetPassword(userRepresentation: KeycloakUserRepresentation, password: String) {

        val credentialRepresentation = CredentialRepresentation()
        credentialRepresentation.type = CredentialRepresentation.PASSWORD
        credentialRepresentation.value = password

        keycloak.realm(this.realm)
            .users()
            .get(userRepresentation.id)
            .resetPassword(credentialRepresentation)
    }

    private fun deleteUserById(userId: String) {
        this.keycloak
            .realm(realm)
            .users()
            .delete(userId)
    }

    private fun findUserByEmail(email: String): KeycloakUserRepresentation? {
        return this.keycloak
            .realm(this.realm)
            .users()
            .search(email)
            .firstOrNull()
    }

    private fun findKeycloakGroupById(groupId: String): GroupResource? {
        return this.keycloak
            .realm(this.realm)
            .groups()
            .group(groupId)
    }

    private fun createGroupRepresentation(
        keycloakGroupRepresentation: KeycloakGroupRepresentation
    ): GroupRepresentation {
        return GroupRepresentation(
            id = keycloakGroupRepresentation.id,
            name = keycloakGroupRepresentation.name,
            roles = findGroupRoles(keycloakGroupRepresentation),
            membersCount = findGroupMembers(keycloakGroupRepresentation).size
        )
    }

    private fun createGroupMembersRepresentation(
        keycloakGroupRepresentation: KeycloakGroupRepresentation
    ): GroupMembersRepresentation {
        return GroupMembersRepresentation(
            id = keycloakGroupRepresentation.id,
            name = keycloakGroupRepresentation.name,
            roles = findGroupRoles(keycloakGroupRepresentation),
            members = findGroupMembers(keycloakGroupRepresentation)
        )
    }

    private fun CreateGroupRequest.toKeycloakRepresentation(): KeycloakGroupRepresentation {
        val representation = KeycloakGroupRepresentation()
        representation.name = this.name
        representation.realmRoles = this.roleIds
        representation.path = createGroupPath(this.name)
        return representation
    }

    private fun UpdateGroupRequest.toKeycloakRepresentation(
        groupId: String
    ): KeycloakGroupRepresentation {
        val representation = KeycloakGroupRepresentation()
        representation.id = groupId
        representation.name = this.name
        representation.realmRoles = this.roleIds
        representation.path = createGroupPath(this.name)
        return representation
    }

    private fun findKeycloakGroupByPath(groupPath: String) = this.keycloak
        .realm(this.realm)
        .getGroupByPath(groupPath)

    private fun findGroupMembers(
        keycloakGroupRepresentation: KeycloakGroupRepresentation
    ): List<UserRepresentation> {
        return this.keycloak
            .realm(this.realm)
            .groups()
            .group(keycloakGroupRepresentation.id)
            .members()
            .map { toUserRepresentation(it) }
    }

    private fun toUserRepresentation(keycloakUserRepresentation: KeycloakUserRepresentation): UserRepresentation {
        return userRepository.findByEmail(keycloakUserRepresentation.username)
            .orElseThrow { NotFoundExceptionLegacy("user", keycloakUserRepresentation.username) }
            .let { user ->
                UserRepresentation(
                    id = user.id,
                    name = user.name,
                    email = user.email,
                    photoUrl = user.photoUrl,
                    isRoot = user.isRoot,
                    createdAt = user.createdAt
                )
            }
    }

    private fun findGroupRoles(
        keycloakGroupRepresentation: KeycloakGroupRepresentation
    ): List<RoleRepresentation> {
        return this.keycloak
            .realm(this.realm)
            .groups()
            .group(keycloakGroupRepresentation.id)
            .roles()
            .realmLevel()
            .listAll()
            .map { RoleRepresentation(id = it.id, name = it.name, description = it.description) }
            .toList()
    }

    private fun findKeycloakRolesById(roleId: String) = this.keycloak
        .realm(this.realm)
        .rolesById()
        .getRole(roleId)

    private fun assignRolesToGroup(
        group: KeycloakGroupRepresentation,
        roleIds: List<String>
    ) {
        findGroupRoles(group)
            .map { it.id }
            .minus(roleIds)
            .let { removeRolesFromGroup(group, it) }
            .let { addRolesToGroup(group, roleIds) }
    }

    private fun addRolesToGroup(
        group: org.keycloak.representations.idm.GroupRepresentation,
        roleIds: List<String>
    ) {
        this.keycloak.realm(this.realm)
            .groups()
            .group(group.id)
            .roles()
            .realmLevel()
            .add(roleIds.map { findKeycloakRolesById(it) })
    }

    private fun removeRolesFromGroup(
        group: KeycloakGroupRepresentation,
        it: List<String>
    ) {
        this.keycloak
            .realm(this.realm)
            .groups()
            .group(group.id)
            .roles()
            .realmLevel()
            .remove(it.map { findKeycloakRolesById(it) })
    }

    private fun CreateRoleRequest.toKeycloakRepresentation(): KeycloakRoleRepresentation {
        val role = KeycloakRoleRepresentation()
        role.name = this.name
        role.description = this.description
        role.isComposite = false
        role.clientRole = false
        return role
    }

    private fun KeycloakGroupRepresentation.toRepresentation() = GroupRepresentation(
        id = this.id,
        name = this.name,
        roles = findGroupRoles(this),
        membersCount = findGroupMembers(this).size
    )

    private fun createGroupPath(groupName: String) = "/$groupName"

    private fun findUserGroupsByUsername(username: String): List<GroupRepresentation> =
        this.keycloak.realm(this.realm)
            .users()
            .search(username)
            .takeIf { it.isNotEmpty() }
            ?.first()
            ?.let { findUserById(it) }
            ?.groups()
            ?.map { it.toRepresentation() }
            ?: throw NotFoundExceptionLegacy("user", username)

    private fun findUserById(keycloakUserRepresentation: KeycloakUserRepresentation) =
        this.keycloak.realm(this.realm).users().get(keycloakUserRepresentation.id)
}
