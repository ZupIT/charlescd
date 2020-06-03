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

package io.charlescd.moove.application.role.response

import io.charlescd.moove.domain.Role
import java.time.LocalDateTime

data class RoleResponse(
    val id: String,
    val name: String,
    val description: String,
    val permissions: List<PermissionResponse>,
    val createdAt: LocalDateTime
) {

    companion object {
        fun from(role: Role): RoleResponse {
            return RoleResponse(
                id = role.id,
                name = role.name,
                description = role.description,
                permissions = role.permissions.map { PermissionResponse.from(it) },
                createdAt = role.createdAt
            )
        }
    }
}
