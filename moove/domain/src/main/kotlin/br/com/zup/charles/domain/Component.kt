/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.domain

import java.time.LocalDateTime

data class Component(
    val id: String,
    val moduleId: String,
    val name: String,
    val contextPath: String?,
    val port: Int?,
    val healthCheck: String?,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val applicationId: String
)
