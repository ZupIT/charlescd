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

import com.fasterxml.jackson.annotation.JsonBackReference
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

    val workspaceId: String
)
