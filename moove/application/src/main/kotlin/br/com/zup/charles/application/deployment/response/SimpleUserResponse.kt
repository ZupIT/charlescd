/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.application.deployment.response

import br.com.zup.charles.domain.User
import com.fasterxml.jackson.annotation.JsonFormat
import java.time.LocalDateTime

data class SimpleUserResponse(
    val id: String,
    val name: String,
    val email: String,
    val photoUrl: String?,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    val createdAt: LocalDateTime
) {
    companion object {

        fun from(user: User): SimpleUserResponse {
            return SimpleUserResponse(
                id = user.id,
                name = user.name,
                email = user.email,
                photoUrl = user.photoUrl,
                createdAt = user.createdAt
            )
        }
    }
}