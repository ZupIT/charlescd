/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.service

import br.com.zup.darwin.commons.extension.toRepresentation
import br.com.zup.darwin.commons.extension.toResourcePageRepresentation
import br.com.zup.darwin.commons.representation.ProblemRepresentation
import br.com.zup.darwin.entity.Problem
import br.com.zup.darwin.entity.User
import br.com.zup.darwin.moove.request.problem.CreateProblemRequest
import br.com.zup.darwin.moove.request.problem.UpdateProblemRequest
import br.com.zup.darwin.repository.ProblemRepository
import br.com.zup.darwin.repository.UserRepository
import br.com.zup.exception.handler.exception.NotFoundException
import br.com.zup.exception.handler.to.ResourceValue
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Component
import java.time.LocalDateTime
import java.util.*

@Component
class ProblemService(
    private val userRepository: UserRepository,
    private val problemRepository: ProblemRepository
) {

    fun create(request: CreateProblemRequest, applicationId: String): ProblemRepresentation {
        return this.userRepository.findById(request.authorId)
            .map { createEntity(it, request, applicationId) }
            .orElseThrow { NotFoundException(ResourceValue("user", request.authorId)) }
            .let { this.problemRepository.save(it) }
            .toRepresentation()
    }

    fun updateById(id: String, request: UpdateProblemRequest, applicationId: String): ProblemRepresentation {
        return this.problemRepository.findByIdAndApplicationId(id, applicationId)
            .map {
                Problem(
                    id = it.id,
                    name = request.name,
                    createdAt = it.createdAt,
                    author = it.author,
                    description = request.description,
                    applicationId = it.applicationId
                )
            }
            .orElseThrow { NotFoundException(ResourceValue("problem", id)) }
            .let { this.problemRepository.save(it) }
            .toRepresentation()
    }

    fun findById(id: String, applicationId: String): ProblemRepresentation {
        return this.problemRepository.findByIdAndApplicationId(id, applicationId)
            .orElseThrow { NotFoundException(ResourceValue("problem", id)) }
            .toRepresentation()
    }

    fun findAll(applicationId: String, pageable: Pageable) =
        this.problemRepository.findAllByApplicationId(
            applicationId,
            pageable
        ).map { it.toRepresentation() }.toResourcePageRepresentation()

    fun deleteById(id: String, applicationId: String) {
        this.problemRepository.findByIdAndApplicationId(id, applicationId)
            .map { this.problemRepository.delete(it) }
            .orElseThrow { NotFoundException(ResourceValue("problem", id)) }
    }

    private fun createEntity(user: User, request: CreateProblemRequest, applicationId: String) = Problem(
        UUID.randomUUID().toString(),
        request.name,
        LocalDateTime.now(),
        author = user,
        description = request.description,
        applicationId = applicationId
    )
}
