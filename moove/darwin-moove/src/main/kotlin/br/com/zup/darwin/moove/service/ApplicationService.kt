/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.service

import br.com.zup.darwin.commons.constants.MooveConstants
import br.com.zup.darwin.commons.extension.toRepresentation
import br.com.zup.darwin.commons.extension.toResourcePageRepresentation
import br.com.zup.darwin.commons.representation.ApplicationRepresentation
import br.com.zup.darwin.commons.representation.ResourcePageRepresentation
import br.com.zup.darwin.commons.request.member.AddMemberRequest
import br.com.zup.darwin.entity.Application
import br.com.zup.darwin.entity.Problem
import br.com.zup.darwin.entity.User
import br.com.zup.darwin.moove.request.application.CreateApplicationRequest
import br.com.zup.darwin.moove.request.application.UpdateApplicationRequest
import br.com.zup.darwin.repository.ApplicationRepository
import br.com.zup.darwin.repository.ProblemRepository
import br.com.zup.darwin.repository.UserRepository
import br.com.zup.exception.handler.exception.NotFoundException
import br.com.zup.exception.handler.to.ResourceValue
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*
import javax.transaction.Transactional

@Service
class ApplicationService(
    private val applicationRepository: ApplicationRepository,
    private val userRepository: UserRepository,
    private val keycloakService: KeycloakService,
    private val problemRepository: ProblemRepository
) {

    fun findAll(pageable: Pageable): ResourcePageRepresentation<ApplicationRepresentation> {
        return applicationRepository.findAll(pageable)
            .map { it.toRepresentation() }
            .toResourcePageRepresentation()
    }

    fun findById(id: String): ApplicationRepresentation {
        return applicationRepository.findById(id)
            .map { it.toRepresentation() }
            .orElseThrow { NotFoundException(ResourceValue("application", id)) }
    }

    fun create(createApplicationRequest: CreateApplicationRequest): ApplicationRepresentation {

        val user = findUser(createApplicationRequest.authorId)

        return createApplicationRequest.toEntity(user)
            .let(this.applicationRepository::save)
            .apply { createApplicationProblem(user, this.id) }
            .toRepresentation()
    }

    @Transactional
    fun update(id: String, updateApplicationRequest: UpdateApplicationRequest): ApplicationRepresentation {
        return this.applicationRepository.findById(id)
            .orElseThrow { NotFoundException(ResourceValue("application", id)) }
            .let { buildUpdatedApplication(updateApplicationRequest, it) }
            .let(this.applicationRepository::save)
            .toRepresentation()
    }

    fun delete(id: String) {
        return applicationRepository.findById(id)
            .orElseThrow { NotFoundException(ResourceValue("application", id)) }
            .let { this.applicationRepository.delete(it) }
    }

    @Transactional
    fun addMembers(id: String, addMemberRequest: AddMemberRequest): ApplicationRepresentation {
        return applicationRepository.findById(id)
            .orElseThrow { NotFoundException(ResourceValue("application", id)) }
            .also { application ->
                application.users.map { user -> user.id }.minus(addMemberRequest.memberIds)
                    .forEach { id -> removeApplicationToKeycloakUser(id, application.id) }
            }
            .let { addMembersToApplication(it, addMemberRequest) }
            .let { applicationRepository.saveAndFlush(it) }
            .also { addMemberRequest.memberIds.forEach { addAplicationsToKeycloakUser(it) } }
            .toRepresentation()
    }

    private fun addAplicationsToKeycloakUser(userId: String) {
        findUser(userId).let { user -> keycloakService.updateUserAttributes(user.email, user.applications.map { application -> application.id }) }
    }

    private fun removeApplicationToKeycloakUser(userId: String, applicationId: String) {
        findUser(userId).let { user -> keycloakService.updateUserAttributes(user.email, user.applications.map { application -> application.id }.minus(applicationId)) }
    }

    private fun buildUpdatedApplication(
        updateApplicationRequest: UpdateApplicationRequest,
        application: Application
    ): Application {
        return Application(
            id = application.id,
            name = updateApplicationRequest.name,
            users = application.users,
            author = application.author
        )
    }

    private fun addMembersToApplication(application: Application, addMemberRequest: AddMemberRequest): Application {
        return addMemberRequest.toEntity()
            .let { application.addUsers(it) }
    }

    private fun AddMemberRequest.toEntity(): Set<User> =
        this.memberIds.map { findUser(it) }.toSet()

    private fun CreateApplicationRequest.toEntity(user: User): Application {
        return Application(
            id = UUID.randomUUID().toString(),
            name = this.name,
            author = user
        )
    }

    private fun findUser(id: String): User {
        return userRepository.findById(id)
            .orElseThrow { NotFoundException(ResourceValue("user", id)) }
    }

    private fun createApplicationProblem(user: User, applicationId: String) {
        problemRepository.save(createProblem(user, applicationId))
    }

    private fun createProblem(user: User, applicationId: String): Problem {
        return Problem(
            UUID.randomUUID().toString(),
            MooveConstants.MOOVE_DEFAULT_QUICK_BOARD_NAME,
            LocalDateTime.now(),
            author = user,
            description = "Application Quick Board",
            applicationId = applicationId
        )
    }

}
