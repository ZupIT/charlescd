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

package io.charlescd.moove.application.usergroup.request

import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.UserGroup
import java.time.LocalDateTime
import java.util.*
import javax.validation.constraints.NotBlank

data class CreateUserGroupRequest(
    @field:NotBlank
    val name: String,

    @field:NotBlank
    val authorId: String
) {

    fun toUserGroup(user: User): UserGroup {
        return UserGroup(
            id = UUID.randomUUID().toString(),
            name = name,
            author = user,
            users = emptyList(),
            createdAt = LocalDateTime.now()
        )
    }
}
