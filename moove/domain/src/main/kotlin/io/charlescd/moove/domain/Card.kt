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

abstract class Card(
    open val id: String,
    open val name: String,
    open val description: String?,
    open var columnId: String,
    open val author: User,
    open val createdAt: LocalDateTime,
    open val comments: MutableList<Comment> = mutableListOf(),
    open val status: CardStatusEnum,
    open val members: MutableList<User> = mutableListOf(),
    open var index: Int? = null,
    open val workspaceId: String
) {

    fun updateColumn(columnId: String): Card {
        this.columnId = columnId
        return this
    }

    fun addComment(comment: Comment): Card {
        this.comments.add(comment)
        return this
    }

    fun addUsers(users: Set<User>): Card {
        this.members.clear()
        this.members.addAll(users)
        return this
    }

    fun removeMember(memberId: String): Card {
        this.members.removeIf { it.id == memberId }
        return this
    }
}
