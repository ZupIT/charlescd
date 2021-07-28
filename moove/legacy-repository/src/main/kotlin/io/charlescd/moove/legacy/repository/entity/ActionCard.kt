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

package io.charlescd.moove.legacy.repository.entity

import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "action_cards")
data class ActionCard(
    @field:Id
    override val id: String,
    override val name: String,
    override val description: String?,
    @Enumerated(EnumType.STRING)
    val type: ActionCardType,
    override var column: CardColumn,
    override val author: User,
    override val createdAt: LocalDateTime,
    override val labels: List<Label> = emptyList(),
    override val comments: MutableList<Comment> = mutableListOf(),
    override val hypothesis: Hypothesis,
    override val status: CardStatus,
    override val members: MutableList<User> = mutableListOf(),
    override var index: Int? = null,
    override val workspaceId: String
) : Card(
    id,
    name,
    description,
    column,
    author,
    createdAt,
    labels,
    comments,
    hypothesis,
    status,
    members,
    index,
    workspaceId
)
