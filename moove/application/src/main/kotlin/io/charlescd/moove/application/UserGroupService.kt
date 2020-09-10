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
import io.charlescd.moove.domain.repository.UserGroupRepository
import javax.inject.Named

@Named
class UserGroupService(private val userGroupRepository: UserGroupRepository) {

    fun save(userGroup: UserGroup): UserGroup {
        return this.userGroupRepository.save(userGroup)
    }

    fun find(id: String): UserGroup {
        return this.userGroupRepository.findById(id)
            .orElseThrow { NotFoundException("user_group", id) }
    }

    fun find(name: String?, pageRequest: PageRequest): Page<UserGroup> {
        return this.userGroupRepository.find(name, pageRequest)
    }

    fun delete(userGroup: UserGroup) {
        this.userGroupRepository.delete(userGroup)
    }

    fun update(userGroup: UserGroup): UserGroup {
        return userGroupRepository.update(userGroup)
    }

    fun addMember(userGroup: UserGroup, member: User) {
        this.userGroupRepository.addMember(userGroup, member)
    }

    fun removeMember(userGroup: UserGroup, member: User) {
        this.userGroupRepository.removeMember(userGroup, member)
    }

    fun findPermissionsFromUserGroupAssociations(userGroup: UserGroup): Map<String, List<Permission>> {
        return userGroupRepository.findPermissionsFromUserGroupAssociations(userGroup)
    }

    fun findPermissionsFromWorkspaceAndUserGroupAssociation(workspaceId: String, userGroup: UserGroup): List<Permission> {
        return userGroupRepository.findPermissions(workspaceId, userGroup)
    }
}
