/*
 *
 *  * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *
 */

package io.charlescd.moove.legacy.moove.service

import io.charlescd.moove.commons.extension.toRepresentation
import io.charlescd.moove.commons.extension.toResourcePageRepresentation
import io.charlescd.moove.commons.representation.ResourcePageRepresentation
import io.charlescd.moove.commons.representation.WorkspaceRepresentation
import io.charlescd.moove.legacy.repository.WorkspaceRepository
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service

@Service
class V1WorkspaceService(
    private val workspaceRepository: WorkspaceRepository
) {
    fun findAll(pageable: Pageable): ResourcePageRepresentation<WorkspaceRepresentation> {
        return workspaceRepository.findAll(pageable)
            .map { it.toRepresentation() }
            .toResourcePageRepresentation()
    }
}
