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

package io.charlescd.moove.application.build.request

import io.charlescd.moove.domain.Build
import io.charlescd.moove.domain.BuildStatusEnum
import io.charlescd.moove.domain.FeatureSnapshot
import io.charlescd.moove.domain.User
import java.time.LocalDateTime
import javax.validation.Valid
import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotEmpty

data class CreateComposedBuildRequest(
    @field:NotBlank
    val releaseName: String,

    @field:NotBlank
    val authorId: String,

    @field:Valid
    @field:NotEmpty
    val modules: List<ModuleRequest>
) {

    data class ModuleRequest(
        @field:NotBlank
        val id: String,

        @field:Valid
        @field:NotEmpty
        val components: List<ComponentRequest>
    )

    data class ComponentRequest(
        @field:NotBlank
        val id: String,

        @field:NotBlank
        val version: String,

        @field:NotBlank
        val artifact: String
    )

    fun toBuild(
        id: String,
        user: User,
        feature: FeatureSnapshot,
        workspaceId: String
    ): Build {
        return Build(
            id = id,
            author = user,
            createdAt = LocalDateTime.now(),
            features = listOf(feature),
            tag = releaseName,
            hypothesisId = null,
            status = BuildStatusEnum.BUILT,
            workspaceId = workspaceId,
            deployments = emptyList()
        )
    }
}
