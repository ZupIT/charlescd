/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.domain

import java.time.LocalDateTime

data class Hypothesis(
    val id: String,
    val name: String,
    val description: String,
    val author: User,
    val createdAt: LocalDateTime,
    val problemId: String,
    val columns: List<Column>,
    val builds: List<Build> = emptyList(),
    val applicationId: String
) {
    fun findColumnByName(name: String): Column {
        return this.columns.first {
            it.name == name
        }
    }

    fun findColumnById(id: String): Column {
        return this.columns.first {
            it.id == id
        }
    }

    fun findFeaturesByColumnName(name: String): List<Feature> {
        return this.columns.first {
            it.name == name
        }.cards.filterIsInstance<SoftwareCard>().map {
            it.feature
        }
    }
}
