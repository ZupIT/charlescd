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
@Table(name = "hypotheses")
data class Hypothesis(

    @field:Id
    val id: String,

    val name: String,

    val description: String,

    @field:[ManyToOne JoinColumn(name = "author_id")]
    val author: User,

    val createdAt: LocalDateTime,

    @ManyToOne
    @field:JsonManagedReference
    @JoinColumn(name = "problem_id")
    val problem: Problem,

    @field:JsonBackReference
    @field:[OneToMany(mappedBy = "hypothesis")]
    val cards: List<Card> = emptyList(),

    @field:ManyToMany
    @field:JoinTable(
        name = "hypotheses_labels",
        joinColumns = [JoinColumn(name = "hypothesis_id")],
        inverseJoinColumns = [JoinColumn(name = "label_id")]
    )
    val labels: List<Label> = emptyList(),

    @field:JsonBackReference
    @field:[OneToMany(mappedBy = "hypothesis")]
    val builds: List<Build> = emptyList(),

    @field:ManyToMany
    @field:JoinTable(
        name = "hypotheses_circles",
        joinColumns = [JoinColumn(name = "hypothesis_id")],
        inverseJoinColumns = [JoinColumn(name = "circle_id")]
    )
    val circles: List<Circle> = emptyList(),

    val applicationId: String

)
