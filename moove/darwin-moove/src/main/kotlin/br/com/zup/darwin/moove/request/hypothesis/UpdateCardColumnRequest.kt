/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.request.hypothesis

import javax.validation.constraints.NotBlank

data class UpdateCardColumnRequest(
    val source: ColumnRequest,
    val destination: ColumnRequest
)

data class OrderCardInColumnRequest(
    @field:NotBlank
    val id: String,
    val cards: List<CardRequest>
)

data class ColumnRequest(
    @field:NotBlank
    val id: String,
    val cards: List<CardRequest>
)

data class CardRequest(
    val id: String
)