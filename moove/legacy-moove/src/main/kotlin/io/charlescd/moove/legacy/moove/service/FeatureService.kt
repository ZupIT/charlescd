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
import io.charlescd.moove.commons.representation.FeatureRepresentation
import io.charlescd.moove.legacy.moove.request.feature.CreateFeatureRequest
import io.charlescd.moove.legacy.moove.request.feature.UpdateFeatureRequest
import io.charlescd.moove.legacy.repository.FeatureRepository
import io.charlescd.moove.legacy.repository.ModuleRepository
import io.charlescd.moove.legacy.repository.UserRepository
import io.charlescd.moove.legacy.repository.entity.Feature
import io.charlescd.moove.legacy.repository.entity.Module
import io.charlescd.moove.legacy.repository.entity.User
import java.time.LocalDateTime
import java.util.*
import javax.transaction.Transactional
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service

@Service
class FeatureService(
    private val featureRepository: FeatureRepository,
    private val userRepository: UserRepository,
    private val moduleRepository: ModuleRepository
) {

    fun create(createFeatureRequest: CreateFeatureRequest, workspaceId: String): FeatureRepresentation {
        return createFeatureRequest.toEntity(workspaceId)
            .let { this.featureRepository.save(it) }.toRepresentation()
    }

    fun findAll(workspaceId: String, pageable: Pageable): Page<FeatureRepresentation> {
        return featureRepository.findAllByWorkspaceId(workspaceId, pageable)
            .map { it.toRepresentation() }
    }

    fun findById(id: String, workspaceId: String): FeatureRepresentation {
        return featureRepository.findByIdAndWorkspaceId(id, workspaceId)
            .map { it.toRepresentation() }
            .orElseThrow { NotFoundExceptionLegacy("feature", id) }
    }

    fun update(id: String, updateFeatureRequest: UpdateFeatureRequest, workspaceId: String): FeatureRepresentation {
        return featureRepository.findByIdAndWorkspaceId(id, workspaceId)
            .map { this.createUpdatedFeature(updateFeatureRequest, it) }
            .map { featureRepository.save(it) }
            .orElseThrow { NotFoundExceptionLegacy("feature", id) }
            .toRepresentation()
    }

    @Transactional
    fun delete(id: String, workspaceId: String) {
        return featureRepository.findByIdAndWorkspaceId(id, workspaceId)
            .orElseThrow { NotFoundExceptionLegacy("feature", id) }
            .also { this.featureRepository.deleteModulesRelationship(id, workspaceId) }
            .let { this.featureRepository.delete(it) }
    }

    private fun findUsers(users: List<String>): List<User> =
        this.userRepository.findAllById(users)
            .takeIf { users.size == it.size }
            ?: throw NotFoundExceptionLegacy(
                "users",
                users.joinToString(", ")
            )

    private fun findModules(modules: List<String>): List<Module> =
        this.moduleRepository.findAllById(modules)
            .takeIf { modules.size == it.size }
            ?: throw NotFoundExceptionLegacy(
                "modules",
                modules.joinToString(", ")
            )

    private fun createUpdatedFeature(updateFeatureRequest: UpdateFeatureRequest, it: Feature): Feature =
        Feature(
            id = it.id,
            name = updateFeatureRequest.name,
            branchName = it.branchName,
            modules = findModules(updateFeatureRequest.modules),
            author = it.author,
            createdAt = it.createdAt,
            workspaceId = it.workspaceId
        )

    private fun CreateFeatureRequest.toEntity(workspaceId: String): Feature {
        return Feature(
            id = UUID.randomUUID().toString(),
            name = this.name,
            branchName = this.branchName,
            modules = findModules(this.modules),
            author = findUsers(listOf(this.authorId)).first(),
            createdAt = LocalDateTime.now(),
            workspaceId = workspaceId
        )
    }
}
