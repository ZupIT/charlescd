/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.entity

import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "features")
data class Feature(
    @field:Id
    val id: String,
    val name: String,
    val branchName: String,

    @field:[ManyToOne JoinColumn(name = "user_id")]
    val author: User,

    val createdAt: LocalDateTime,

    @field:ManyToMany
    @field:JoinTable(
        name = "features_modules",
        joinColumns = [JoinColumn(name = "feature_id")],
        inverseJoinColumns = [JoinColumn(name = "module_id")]
    )
    val modules: List<Module>,

    val applicationId: String

)
