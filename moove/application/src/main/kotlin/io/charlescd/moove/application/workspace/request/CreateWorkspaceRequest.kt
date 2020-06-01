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

package io.charlescd.moove.application.workspace.request

import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.Workspace
import java.time.LocalDateTime
import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull
import javax.validation.constraints.Size

data class CreateWorkspaceRequest(
    @field:NotNull
    @field:NotBlank
    @field:Size(min = 1, max = 50, message = "Name minimum size is 1 and maximum is 50.")
    val name: String,
    @field:NotNull
    @field:NotBlank
    val authorId: String
) {
    fun toWorkspace(id: String, author: User) = Workspace(
        id = id,
        name = name,
        author = author,
        createdAt = LocalDateTime.now()
    )
}
