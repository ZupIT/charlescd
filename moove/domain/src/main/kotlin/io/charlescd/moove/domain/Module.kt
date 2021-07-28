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

package io.charlescd.moove.domain

import java.time.LocalDateTime

data class Module(
    val id: String,
    val name: String,
    val gitRepositoryAddress: String,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val helmRepository: String,
    val author: User,
    val labels: List<Label>? = emptyList(),
    val gitConfiguration: GitConfiguration? = null,
    val components: List<Component> = emptyList(),
    val workspaceId: String
) {

    fun findComponentById(componentId: String): Component? {
        return this.components.firstOrNull { componentId == it.id }
    }

    fun findComponentsByIds(componentIds: List<String>): List<Component> {
        return this.components.filter { componentIds.contains(it.id) }
    }

    fun findComponentByName(name: String): Component? {
        return this.components.firstOrNull { it.name.toLowerCase() == name.toLowerCase() }
    }
}
