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

    val applicationId: String,

    @field:JsonBackReference
    @field:[OneToMany(mappedBy = "build", cascade = [CascadeType.REMOVE])]
    val deployments: List<Deployment> = emptyList(),

    @field:JsonBackReference
    @field:[OneToMany(mappedBy = "build", cascade = [CascadeType.REMOVE, CascadeType.MERGE])]
    val artifacts: List<Artifact> = emptyList()

) {

    fun canBeUpdated(): Boolean = this.status == BuildStatus.BUILDING

    fun canBeDeployed(): Boolean = this.status == BuildStatus.BUILT || this.status == BuildStatus.VALIDATED

}
