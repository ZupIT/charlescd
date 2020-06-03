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

package io.charlescd.moove.application.build.impl

import io.charlescd.moove.application.BuildService
import io.charlescd.moove.application.build.ArchiveBuildInteractor
import io.charlescd.moove.domain.BuildStatusEnum
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.exceptions.BusinessException
import javax.inject.Inject
import javax.inject.Named
import javax.transaction.Transactional

@Named
open class ArchiveBuildInteractorImpl @Inject constructor(
    private val buildService: BuildService
) : ArchiveBuildInteractor {

    @Transactional
    override fun execute(id: String, workspaceId: String) {
        val build = buildService.find(id, workspaceId)

        if (!build.canBeArchived()) {
            throw BusinessException.of(MooveErrorCode.ARCHIVE_DEPLOYED_BUILD)
        }

        buildService.updateStatus(id, BuildStatusEnum.ARCHIVED)
    }
}
