/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.domain

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