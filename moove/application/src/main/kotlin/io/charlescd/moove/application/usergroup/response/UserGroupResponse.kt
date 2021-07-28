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

package io.charlescd.moove.application.usergroup.response

import com.fasterxml.jackson.annotation.JsonFormat
import io.charlescd.moove.application.user.response.SimpleUserResponse
import io.charlescd.moove.domain.UserGroup
import java.time.LocalDateTime

data class UserGroupResponse(
    val id: String,
    val name: String,
    val author: SimpleUserResponse,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    val createdAt: LocalDateTime,
    val users: List<SimpleUserResponse>
) {

    companion object {

        fun from(userGroup: UserGroup): UserGroupResponse {
            return UserGroupResponse(
                id = userGroup.id,
                name = userGroup.name,
                author = SimpleUserResponse.from(userGroup.author),
                createdAt = userGroup.createdAt,
                users = userGroup.users.map { user -> SimpleUserResponse.from(user) }
            )
        }
    }
}
