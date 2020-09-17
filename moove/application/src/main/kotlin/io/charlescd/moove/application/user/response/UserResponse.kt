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

package io.charlescd.moove.application.user.response

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonProperty
import io.charlescd.moove.application.workspace.response.SimpleWorkspaceResponse
import io.charlescd.moove.domain.User
import java.time.LocalDateTime

data class UserResponse(
    val id: String,
    val name: String,
    val email: String,
    val photoUrl: String?,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    val createdAt: LocalDateTime,
    val workspaces: List<SimpleWorkspaceResponse>,
    @get:JsonProperty("isRoot")
    val isRoot: Boolean
) {
    companion object {
        fun from(user: User) = UserResponse(
            id = user.id,
            name = user.name,
            email = user.email,
            photoUrl = user.photoUrl,
            createdAt = user.createdAt,
            workspaces = user.workspaces.map { workspace ->
                SimpleWorkspaceResponse(
                    workspace.id,
                    workspace.name,
                    workspace.permissions.map { permission -> permission.name })
            },
            isRoot = user.root
        )
    }
}
