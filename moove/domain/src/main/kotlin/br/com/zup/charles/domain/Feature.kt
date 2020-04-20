/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.domain

import java.time.LocalDateTime

data class Feature(
    val id: String,
    val name: String,
    val branchName: String,
    val author: User,
    val createdAt: LocalDateTime,
    val modules: List<Module>,
    val applicationId: String
)
