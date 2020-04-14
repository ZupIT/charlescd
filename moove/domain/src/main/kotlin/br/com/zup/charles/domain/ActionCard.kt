/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.domain

import java.time.LocalDateTime

data class ActionCard(
    override val id: String,
    override val name: String,
    override val description: String?,
    val type: ActionCardTypeEnum,
    override var columnId: String,
    override val author: User,
    override val createdAt: LocalDateTime,
    val labels: List<Label> = emptyList(),
    override val comments: MutableList<Comment> = mutableListOf(),
    override val status: CardStatusEnum,
    override val members: MutableList<User> = mutableListOf(),
    override var index: Int? = null,
    override val applicationId: String
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
    applicationId
)
