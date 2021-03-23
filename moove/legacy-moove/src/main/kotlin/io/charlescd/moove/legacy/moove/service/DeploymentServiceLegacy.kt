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

import io.charlescd.moove.commons.exceptions.NotFoundExceptionLegacy
import io.charlescd.moove.commons.extension.toRepresentation
import io.charlescd.moove.commons.extension.toResourcePageRepresentation
import io.charlescd.moove.commons.representation.DeploymentRepresentation
import io.charlescd.moove.commons.representation.ResourcePageRepresentation
import io.charlescd.moove.legacy.repository.DeploymentRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Component

@Component
class DeploymentServiceLegacy(
    private val deploymentRepository: DeploymentRepository
) {

    @Value("\${charlescd.moove.url}")
    lateinit var MOOVE_BASE_PATH: String

    fun getDeploymentById(id: String, applicationId: String): DeploymentRepresentation {
        return this.deploymentRepository.findByIdAndWorkspaceId(id, applicationId)
            .map { it.toRepresentation() }
            .orElseThrow { NotFoundExceptionLegacy("deployment", id) }
    }

    fun getAllDeployments(
        workspaceId: String,
        pageable: Pageable
    ): ResourcePageRepresentation<DeploymentRepresentation> {
        return this.deploymentRepository.findAllByWorkspaceId(workspaceId, pageable)
            .map { it.toRepresentation() }
            .toResourcePageRepresentation()
    }

    fun deleteDeploymentById(id: String, workspaceId: String) {
        return this.deploymentRepository.findByIdAndWorkspaceId(id, workspaceId)
            .map { this.deploymentRepository.delete(it) }
            .orElseThrow { NotFoundExceptionLegacy("deployment", id) }
    }
}
