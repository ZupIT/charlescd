/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.service

import br.com.zup.darwin.commons.extension.toRepresentation
import br.com.zup.darwin.commons.representation.FeatureRepresentation
import br.com.zup.darwin.entity.Feature
import br.com.zup.darwin.entity.Module
import br.com.zup.darwin.entity.User
import br.com.zup.darwin.moove.request.feature.CreateFeatureRequest
import br.com.zup.darwin.moove.request.feature.UpdateFeatureRequest
import br.com.zup.darwin.repository.FeatureRepository
import br.com.zup.darwin.repository.ModuleRepository
import br.com.zup.darwin.repository.UserRepository
import br.com.zup.exception.handler.exception.NotFoundException
import br.com.zup.exception.handler.to.ResourceValue
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*
import javax.transaction.Transactional

@Service
class FeatureService(
    private val featureRepository: FeatureRepository,
    private val userRepository: UserRepository,
    private val moduleRepository: ModuleRepository
) {

    fun create(createFeatureRequest: CreateFeatureRequest, applicationId: String): FeatureRepresentation {
        return createFeatureRequest.toEntity(applicationId)
            .let { this.featureRepository.save(it) }.toRepresentation()
    }

    fun findAll(applicationId: String, pageable: Pageable): Page<FeatureRepresentation> {
        return featureRepository.findAllByApplicationId(applicationId, pageable)
            .map { it.toRepresentation() }
    }

    fun findById(id: String, applicationId: String): FeatureRepresentation {
        return featureRepository.findByIdAndApplicationId(id, applicationId)
            .map { it.toRepresentation() }
            .orElseThrow { NotFoundException(ResourceValue("feature", id)) }
    }

    fun update(id: String, updateFeatureRequest: UpdateFeatureRequest, applicationId: String): FeatureRepresentation {
        return featureRepository.findByIdAndApplicationId(id, applicationId)
            .map { this.createUpdatedFeature(updateFeatureRequest, it) }
            .map { featureRepository.save(it) }
            .orElseThrow { NotFoundException(ResourceValue("feature", id)) }
            .toRepresentation()
    }

    @Transactional
    fun delete(id: String, applicationId: String) {
        return featureRepository.findByIdAndApplicationId(id, applicationId)
            .orElseThrow { NotFoundException(ResourceValue("feature", id)) }
            .also { this.featureRepository.deleteModulesRelationship(id, applicationId) }
            .let { this.featureRepository.delete(it) }
    }

    private fun findUsers(users: List<String>): List<User> =
        this.userRepository.findAllById(users)
            .takeIf { users.size == it.size }
            ?: throw NotFoundException(
                ResourceValue(
                    "users",
                    users.joinToString(", ")
                )
            )

    private fun findModules(modules: List<String>): List<Module> =
        this.moduleRepository.findAllById(modules)
            .takeIf { modules.size == it.size }
            ?: throw NotFoundException(
                ResourceValue(
                    "modules",
                    modules.joinToString(", ")
                )
            )

    private fun createUpdatedFeature(updateFeatureRequest: UpdateFeatureRequest, it: Feature): Feature =
        Feature(
            id = it.id,
            name = updateFeatureRequest.name,
            branchName = it.branchName,
            modules = findModules(updateFeatureRequest.modules),
            author = it.author,
            createdAt = it.createdAt,
            applicationId = it.applicationId
        )

    private fun CreateFeatureRequest.toEntity(applicationId: String): Feature {
        return Feature(
            id = UUID.randomUUID().toString(),
            name = this.name,
            branchName = this.branchName,
            modules = findModules(this.modules),
            author = findUsers(listOf(this.authorId)).first(),
            createdAt = LocalDateTime.now(),
            applicationId = applicationId
        )
    }
}
