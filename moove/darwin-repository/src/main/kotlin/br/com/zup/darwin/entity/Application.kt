/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.entity

import com.fasterxml.jackson.annotation.JsonManagedReference
import javax.persistence.*

@Entity
@Table(name = "applications")
data class Application(

    @field:Id
    val id: String,

    val name: String,

    @field:ManyToMany
    @field:JoinTable(
        name = "users_applications",
        joinColumns = [JoinColumn(name = "application_id")],
        inverseJoinColumns = [JoinColumn(name = "user_id")]
    )
    val users: MutableList<User> = mutableListOf(),

    @field:JsonManagedReference
    @field:ManyToOne
    @field:JoinColumn(name = "user_id")
    val author: User

) {

    fun addUsers(users: Set<User>): Application {
        this.users.clear()
        this.users.addAll(users)
        return this
    }

}