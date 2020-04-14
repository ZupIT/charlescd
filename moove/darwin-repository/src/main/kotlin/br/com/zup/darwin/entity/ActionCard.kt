/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.entity

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
    override val applicationId: String
) : Card(id, name, description, column, author, createdAt, labels, comments, hypothesis, status, members, index, applicationId)
