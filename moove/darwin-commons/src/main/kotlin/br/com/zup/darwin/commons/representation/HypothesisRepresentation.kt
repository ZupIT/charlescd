/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.commons.representation

data class HypothesisRepresentation(
    val id: String,
    val name: String,
    val description: String,
    val author: SimpleUserRepresentation,
    val problem: SimpleProblemRepresentation,
    val labels: List<SimpleLabelRepresentation> = emptyList(),
    val cards: List<SimpleCardRepresentation> = emptyList(),
    val builds: List<BuildRepresentation> = emptyList(),
    val circles: List<CircleRepresentation> = emptyList()
)