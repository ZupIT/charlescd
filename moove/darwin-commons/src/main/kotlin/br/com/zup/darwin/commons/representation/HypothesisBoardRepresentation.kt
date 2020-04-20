/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.commons.representation

data class HypothesisBoardRepresentation(
    val board: List<CardsByColumnsRepresentation>
)

data class CardsByColumnsRepresentation(
    val id: String,
    val name: String,
    var cards: List<SimpleCardRepresentation> = listOf(),
    var builds: List<SimpleBuildRepresentation> = listOf()
)