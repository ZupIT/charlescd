/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.domain

data class Column(
    val id: String,
    val name: String,
    val hypothesisId: String,
    val cards: List<Card>,
    val applicationId: String
)
