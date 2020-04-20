/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.commons.representation

import com.fasterxml.jackson.annotation.JsonFormat
import java.time.LocalDateTime

data class CardRepresentation(
    val id: String,
    val name: String,
    val description: String?,
    val column: CardColumnRepresentation,
    val author: SimpleUserRepresentation,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    val createdAt: LocalDateTime,
    val labels: List<SimpleLabelRepresentation>,
    val type: String,
    val feature: FeatureRepresentation?,
    val hypothesisId: String,
    val comments: List<CommentRepresentation> = emptyList(),
    val members: List<UserRepresentation> = emptyList(),
    val index: Int?
)