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

data class SoftwareCard(
    override val id: String,
    override val name: String,
    override val description: String?,
    override var columnId: String,
    val type: SoftwareCardTypeEnum,
    override val author: User,
    override val createdAt: LocalDateTime,
    val feature: Feature,
    override val comments: MutableList<Comment> = mutableListOf(),
    override val status: CardStatusEnum = CardStatusEnum.ACTIVE,
    override val members: MutableList<User> = mutableListOf(),
    override var index: Int? = null,
    override val workspaceId: String
) : Card(
    id,
    name,
    description,
    columnId,
    author,
    createdAt,
    comments,
    status,
    members,
    index,
    workspaceId
)
