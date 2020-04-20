/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.domain

import com.fasterxml.jackson.databind.JsonNode
import java.time.LocalDateTime

data class Circle(
    val id: String,
    val name: String,
    val reference: String?,
    val author: User?,
    val createdAt: LocalDateTime,
    val matcherType: MatcherTypeEnum,
    val rules: JsonNode? = null,
    val importedKvRecords: Int? = null,
    val importedAt: LocalDateTime? = null
) {
    companion object {
        const val DEFAULT_CIRCLE_NAME = "Default"
    }

    fun isDefault(): Boolean = this.name.equals(DEFAULT_CIRCLE_NAME, ignoreCase = true)
}

