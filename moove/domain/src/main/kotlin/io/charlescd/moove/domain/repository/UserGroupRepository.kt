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

package io.charlescd.moove.domain.repository

import io.charlescd.moove.domain.*
import java.util.*

interface UserGroupRepository {

    fun save(userGroup: UserGroup): UserGroup

    fun update(userGroup: UserGroup): UserGroup

    fun findById(id: String): Optional<UserGroup>

    fun find(name: String?, page: PageRequest): Page<UserGroup>

    fun delete(userGroup: UserGroup)

    fun addMember(userGroup: UserGroup, member: User)

    fun removeMember(userGroup: UserGroup, member: User)

    fun findPermissionsFromUserGroupAssociations(userGroup: UserGroup): Map<String, List<Permission>>

    fun findPermissions(workspaceId: String, userGroup: UserGroup): List<Permission>
}
