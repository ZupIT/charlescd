/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.api.response

import com.fasterxml.jackson.annotation.JsonFormat
import java.time.LocalDateTime
import java.util.*

data class NotificationRepresentationResponse(
        val id: UUID,
        @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
        val createdAt: LocalDateTime,
        val title: String,
        val content: String,
        val group: String,
        val authorAvatar: String,
        val read: Boolean
)
