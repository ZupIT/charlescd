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
@Table(name = "deployments")
data class Deployment(

    @field:Id
    val id: String,

    @field:ManyToOne
    @field:JoinColumn(name = "user_id")
    val author: User,

    val createdAt: LocalDateTime,

    val deployedAt: LocalDateTime?,

    @Enumerated(EnumType.STRING)
    val status: DeploymentStatus,

    @field:ManyToOne
    @field:JoinColumn(name = "circle_id")
    val circle: Circle,

    @field:ManyToOne
    @field:JsonManagedReference
    @field:JoinColumn(name = "build_id")
    val build: Build,

    val applicationId: String
)
