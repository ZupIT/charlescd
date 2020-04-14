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
@Table(name = "artifacts")
data class Artifact(

    @field:Id
    val id: String,

    val artifact: String,

    val version: String,

    val createdAt: LocalDateTime,

    @field:ManyToOne
    @field:JsonManagedReference
    @field:JoinColumn(name = "build_id")
    val build: Build,

    @field:ManyToOne
    @field:JoinColumn(name = "component_id")
    val component: Component

)