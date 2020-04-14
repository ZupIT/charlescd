/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.domain

import java.time.LocalDateTime

data class Label(
    val id: String,
    val name: String,
    val createdAt: LocalDateTime,
    val author: User,
    val hexColor: String
)
