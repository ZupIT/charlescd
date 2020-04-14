/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.commons.representation

data class SimpleHypothesisRepresentation(
    val id: String,
    val name: String,
    val description: String,
    val labels: List<SimpleLabelRepresentation> = emptyList(),
    val circlesCount: Int
)