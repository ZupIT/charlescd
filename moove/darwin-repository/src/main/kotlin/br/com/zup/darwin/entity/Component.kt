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
@Table(name = "components")
data class Component(

    @field:Id
    val id: String,

    val name: String,

    val contextPath: String?,

    val port: Int?,

    val healthCheck: String?,

    val createdAt: LocalDateTime = LocalDateTime.now(),

    @field:ManyToOne
    @field:JsonManagedReference
    @field:JoinColumn(name = "module_id")
    val module: Module,

    @field:[OneToMany(mappedBy = "component")]
    val artifacts: List<Artifact> = emptyList(),

    val applicationId: String
)
