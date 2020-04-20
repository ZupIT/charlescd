/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.application.build.response

import br.com.zup.charles.domain.FeatureSnapshot
import com.fasterxml.jackson.annotation.JsonFormat
import java.time.LocalDateTime

data class FeatureResponse(
    val id: String,
    val name: String,
    val branchName: String,
    val authorId: String,
    val authorName: String,
    val modules: List<ModuleResponse>,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    val createdAt: LocalDateTime,
    val branches: List<String>
) {

    companion object {
        fun from(feature: FeatureSnapshot): FeatureResponse {
            return FeatureResponse(
                id = feature.id,
                name = feature.name,
                branchName = feature.branchName,
                authorId = feature.authorId,
                authorName = feature.authorName,
                modules = feature.modules.map { ModuleResponse.from(it) },
                createdAt = feature.createdAt,
                branches = feature.modules
                    .map { it.gitRepositoryAddress }
                    .map { "$it/tree/${feature.branchName}" }
            )
        }
    }
}