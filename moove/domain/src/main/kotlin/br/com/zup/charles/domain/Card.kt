/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.domain

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
    open val applicationId: String
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