/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.entity

import com.fasterxml.jackson.annotation.JsonManagedReference
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "cards")
abstract class Card(
    @field:Id
    open val id: String,

    open val name: String,

    open val description: String?,

    @field:ManyToOne
    @field:JoinColumn(name = "card_column_id")
    open var column: CardColumn,

    @field:ManyToOne
    @field:JoinColumn(name = "user_id")
    open val author: User,

    open val createdAt: LocalDateTime,

    @ManyToMany
    @JoinTable(
        name = "cards_labels",
        joinColumns = [JoinColumn(name = "card_id")],
        inverseJoinColumns = [JoinColumn(name = "label_id")]
    )
    open val labels: List<Label>,

    @ManyToMany
    @JoinTable(
        name = "cards_comments",
        joinColumns = [JoinColumn(name = "card_id")],
        inverseJoinColumns = [JoinColumn(name = "comment_id")]
    )
    open val comments: MutableList<Comment> = mutableListOf(),

    @field:ManyToOne
    @field:JsonManagedReference
    @JoinColumn(name = "hypothesis_id")
    open val hypothesis: Hypothesis,

    @Enumerated(EnumType.STRING)
    open val status: CardStatus,

    @ManyToMany
    @JoinTable(
        name = "cards_users",
        joinColumns = [JoinColumn(name = "card_id")],
        inverseJoinColumns = [JoinColumn(name = "user_id")]
    )
    open val members: MutableList<User> = mutableListOf(),

    open var index: Int? = null,

    open val applicationId: String
) {

    fun updateColumn(cardColumn: CardColumn): Card {
        this.column = cardColumn
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

    fun calculateIndex(): Card {
        this.index = this.hypothesis.cards.filter { it.column.id == column.id }.count()
        return this
    }
}