/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.entity

import com.fasterxml.jackson.annotation.JsonBackReference
import com.fasterxml.jackson.annotation.JsonManagedReference
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "problems")
data class Problem(

    @field:Id
    val id: String,

    val name: String,

    val createdAt: LocalDateTime,

    @field:ManyToOne
    @JoinColumn(name = "user_id")
    val author: User?,

    @field:Column
    val description: String,

    @field:JsonBackReference
    @field:OneToMany(mappedBy = "problem")
    val hypotheses: List<Hypothesis> = emptyList(),

    val applicationId: String
)
