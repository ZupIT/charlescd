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
import io.charlescd.moove.commons.representation.LabelRepresentation
import io.charlescd.moove.legacy.moove.request.label.CreateLabelRequest
import io.charlescd.moove.legacy.moove.request.label.UpdateLabelRequest
import io.charlescd.moove.legacy.repository.LabelRepository
import io.charlescd.moove.legacy.repository.UserRepository
import io.charlescd.moove.legacy.repository.entity.Label
import io.charlescd.moove.legacy.repository.entity.User
import java.time.Clock
import java.time.LocalDateTime
import java.util.*
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service

@Service
class LabelService(
    private val labelRepository: LabelRepository,
    private val userRepository: UserRepository,
    private val clock: Clock
) {
    fun findAll(pageable: Pageable): Page<LabelRepresentation> {
        return labelRepository.findAll(pageable)
            .map { it.toRepresentation() }
    }

    fun findById(id: String): LabelRepresentation {
        return labelRepository.findById(id)
            .map(this::toRepresentation)
            .orElseThrow { NotFoundExceptionLegacy("label", id) }
    }

    fun create(createLabelRequest: CreateLabelRequest): LabelRepresentation {
        return createLabelRequest.toModel()
            .let(this::saveModel)
            .toRepresentation()
    }

    fun update(id: String, updateLabelRequest: UpdateLabelRequest): LabelRepresentation {
        return labelRepository.findById(id)
            .map(this.updateModelData(updateLabelRequest))
            .map(this::saveModel)
            .map(this::toRepresentation)
            .orElseThrow { NotFoundExceptionLegacy("label", id) }
    }

    fun delete(id: String): LabelRepresentation {
        return labelRepository.findById(id)
            .map(this::deleteModel)
            .map(this::toRepresentation)
            .orElseThrow { NotFoundExceptionLegacy("label", id) }
    }

    private fun findUserById(id: String): User =
        userRepository.findById(id)
            .orElseThrow { NotFoundExceptionLegacy("user", id) }

    private fun updateModelData(updateLabelRequest: UpdateLabelRequest): (Label) -> Label = { label ->
            label.copy(
                name = updateLabelRequest.name,
                hexColor = updateLabelRequest.hexColor,
                author = findUserById(updateLabelRequest.authorId)
            )
        }

    private fun saveModel(label: Label): Label =
        labelRepository.save(label)

    private fun deleteModel(label: Label): Label =
        label.also { labelRepository.delete(it) }

    private fun toRepresentation(label: Label): LabelRepresentation = label.toRepresentation()

    private fun CreateLabelRequest.toModel() = Label(
        id = UUID.randomUUID().toString(),
        hexColor = this.hexColor,
        author = findUserById(this.authorId),
        name = this.name,
        createdAt = LocalDateTime.now(clock)
    )
}
