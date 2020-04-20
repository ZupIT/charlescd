/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.application.build.request

import br.com.zup.charles.domain.Build
import br.com.zup.charles.domain.BuildStatusEnum
import br.com.zup.charles.domain.FeatureSnapshot
import br.com.zup.charles.domain.User
import java.time.LocalDateTime
import java.util.*
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
        applicationId: String
    ): Build {
        return Build(
            id = id,
            author = user,
            createdAt = LocalDateTime.now(),
            features = listOf(feature),
            tag = releaseName,
            hypothesisId = null,
            status = BuildStatusEnum.BUILT,
            applicationId = applicationId,
            deployments = emptyList()
        )
    }
}