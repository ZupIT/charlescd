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
import java.util.*

data class FeatureSnapshot(
    val id: String,
    val featureId: String,
    val name: String,
    val branchName: String,
    val createdAt: LocalDateTime,
    val authorName: String,
    val authorId: String,
    val modules: List<ModuleSnapshot>,
    val buildId: String
) {
    companion object {
        fun from(id: String, buildId: String, feature: Feature) = FeatureSnapshot(
            id = id,
            featureId = feature.id,
            name = feature.name,
            branchName = feature.branchName,
            authorName = feature.author.name,
            authorId = feature.author.id,
            createdAt = feature.createdAt,
            buildId = buildId,
            modules = feature.modules.map {
                ModuleSnapshot.from(UUID.randomUUID().toString(), id, it)
            }
        )
    }
}
