/*
 *
 *  * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *
 */

package io.charlescd.moove.application

import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.repository.WorkspaceRepository
import javax.inject.Named

@Named
class WorkspaceService(
    private val workspaceRepository: WorkspaceRepository,
    private val userRepository: UserRepository
) {

    fun find(workspaceId: String): Workspace {
        return this.workspaceRepository.find(workspaceId)
            .orElseThrow { NotFoundException("workspace", workspaceId) }
    }

    fun findAll(pageRequest: PageRequest, name: String?): Page<Workspace> {
        return workspaceRepository.find(pageRequest, name)
    }

    fun checkIfWorkspaceExists(workspaceId: String) {
        if (!this.workspaceRepository.exists(workspaceId)) {
            throw NotFoundException("workspace", workspaceId)
        }
    }

    fun save(workspace: Workspace): Workspace {
        return this.workspaceRepository.save(workspace)
    }

    fun update(workspace: Workspace): Workspace {
        return workspaceRepository.update(workspace)
    }

    fun associateUserGroupAndPermissions(workspaceId: String, userGroupId: String, permissions: List<Permission>) {
        this.workspaceRepository.associateUserGroupAndPermissions(workspaceId, userGroupId, permissions)
    }

    fun disassociateUserGroupAndPermissions(workspaceId: String, userGroupId: String) {
        this.workspaceRepository.disassociateUserGroupAndPermissions(workspaceId, userGroupId)
    }

    fun findAllUsers(workspaceId: String, name: String?, email: String?, pageRequest: PageRequest): Page<User> {
        return this.userRepository.findByWorkspace(workspaceId, name, email, pageRequest)
    }

    fun findUserPermissions(workspaceId: String, user: User): Map<String, List<Permission>> {
        return workspaceRepository.findPermissions(workspaceId, user)
    }
}
