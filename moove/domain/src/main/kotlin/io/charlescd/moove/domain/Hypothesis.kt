/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.charlescd.moove.domain

import java.time.LocalDateTime

data class Hypothesis(
    val id: String,
    val name: String,
    val description: String,
    val author: User,
    val createdAt: LocalDateTime,
    val columns: List<Column>,
    val builds: List<Build> = emptyList(),
    val workspaceId: String
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
