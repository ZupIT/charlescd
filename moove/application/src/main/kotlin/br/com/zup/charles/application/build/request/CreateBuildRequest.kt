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
import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull

data class CreateBuildRequest(

    @field:NotBlank
    val authorId: String,

    @field:NotNull
    @field:NotEmpty
    val features: List<String>,

    @field:NotBlank
    val tagName: String,

    @field:NotBlank
    val hypothesisId: String

) {
    fun toBuild(
        id: String,
        user: User,
        features: List<FeatureSnapshot>,
        applicationId: String,
        columnId: String
    ): Build {
        return Build(
            id = id,
            author = user,
            createdAt = LocalDateTime.now(),
            features = features,
            tag = tagName,
            hypothesisId = hypothesisId,
            status = BuildStatusEnum.BUILDING,
            applicationId = applicationId,
            deployments = emptyList(),
            columnId = columnId
        )
    }
}


