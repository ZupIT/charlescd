/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.domain

data class Application(
    val id: String,
    val name: String,
    val users: MutableList<User> = mutableListOf(),
    val author: User
) {

    fun addUsers(users: Set<User>): Application {
        this.users.clear()
        this.users.addAll(users)
        return this
    }

}