/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.entity

import com.fasterxml.jackson.annotation.JsonBackReference
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "users")
data class User(

    @field:Id
    val id: String,

    val name: String,

    val email: String,

    val photoUrl: String?,

    @field:JsonBackReference
    @field:ManyToMany
    @field:JoinTable(
        name = "users_applications",
        joinColumns = [JoinColumn(name = "user_id")],
        inverseJoinColumns = [JoinColumn(name = "application_id")]
    )
    val applications: List<Application> = listOf(),

    val createdAt: LocalDateTime
)
