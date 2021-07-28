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
import com.fasterxml.jackson.annotation.JsonManagedReference
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "builds")
data class Build(

    @field:Id
    val id: String,

    @field:ManyToOne
    @field:JoinColumn(name = "user_id")
    val author: User,

    val createdAt: LocalDateTime,

    @field:ManyToMany(cascade = [CascadeType.MERGE])
    @field:JoinTable(
        name = "builds_features",
        joinColumns = [JoinColumn(name = "build_id")],
        inverseJoinColumns = [JoinColumn(name = "feature_id")]
    )
    val features: List<Feature>,

    val tag: String,

    @field:ManyToOne
    @field:JsonManagedReference
    @JoinColumn(name = "hypothesis_id")
    val hypothesis: Hypothesis? = null,

    @field:ManyToOne
    @field:JoinColumn(name = "card_column_id")
    val column: CardColumn? = null,

    @Enumerated(EnumType.STRING)
    val status: BuildStatus,

    val workspaceId: String,

    @field:JsonBackReference
    @field:[OneToMany(mappedBy = "build", cascade = [CascadeType.REMOVE])]
    val deployments: List<Deployment> = emptyList()

) {

    fun canBeUpdated(): Boolean = this.status == BuildStatus.BUILDING

    fun canBeDeployed(): Boolean = this.status == BuildStatus.BUILT || this.status == BuildStatus.VALIDATED
}
