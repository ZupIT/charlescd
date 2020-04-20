/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.service

import br.com.zup.darwin.commons.extension.toRepresentation
import br.com.zup.darwin.commons.representation.LabelRepresentation
import br.com.zup.darwin.entity.Label
import br.com.zup.darwin.entity.User
import br.com.zup.darwin.moove.request.label.CreateLabelRequest
import br.com.zup.darwin.moove.request.label.UpdateLabelRequest
import br.com.zup.darwin.repository.LabelRepository
import br.com.zup.darwin.repository.UserRepository
import br.com.zup.exception.handler.exception.NotFoundException
import br.com.zup.exception.handler.to.ResourceValue
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.time.Clock
import java.time.LocalDateTime
import java.util.*

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
            .orElseThrow { NotFoundException(ResourceValue("label", id)) }
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
            .orElseThrow { NotFoundException(ResourceValue("label", id)) }
    }

    fun delete(id: String): LabelRepresentation {
        return labelRepository.findById(id)
            .map(this::deleteModel)
            .map(this::toRepresentation)
            .orElseThrow { NotFoundException(ResourceValue("label", id)) }
    }

    private fun findUserById(id: String): User =
        userRepository.findById(id)
            .orElseThrow { NotFoundException(ResourceValue("user", id)) }

    private fun updateModelData(updateLabelRequest: UpdateLabelRequest): (Label) -> Label =
        { label ->
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
