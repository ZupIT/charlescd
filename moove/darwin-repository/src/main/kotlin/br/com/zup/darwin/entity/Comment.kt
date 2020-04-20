/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.entity

import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "comments")
data class Comment(
    @field:Id
    val id: String,
    @ManyToOne
    @JoinColumn(name = "author_id")
    val author: User,
    val createdAt: LocalDateTime,
    val comment: String
)
