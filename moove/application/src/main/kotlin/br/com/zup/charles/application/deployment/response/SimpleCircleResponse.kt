/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.application.deployment.response

import br.com.zup.charles.domain.Circle
import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.databind.JsonNode
import java.time.LocalDateTime

data class SimpleCircleResponse(
    val id: String,
    val name: String,
    val author: SimpleUserResponse?,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    val createdAt: LocalDateTime,
    val matcherType: String,
    val rules: JsonNode?,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    val importedAt: LocalDateTime?,
    val importedKvRecords: Int?
) {

    companion object {

        fun from(circle: Circle): SimpleCircleResponse {
            return SimpleCircleResponse(
                id = circle.id,
                name = circle.name,
                author = if (circle.author != null) SimpleUserResponse.from(circle.author!!) else null,
                createdAt = circle.createdAt,
                matcherType = circle.matcherType.name,
                rules = circle.rules,
                importedAt = circle.importedAt,
                importedKvRecords = circle.importedKvRecords
            )
        }

    }

}