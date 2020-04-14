/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.application.configuration.impl

import br.com.zup.charles.application.configuration.CreateGitConfigurationInteractor
import br.com.zup.charles.application.configuration.request.CreateGitConfigurationRequest
import br.com.zup.charles.application.configuration.response.GitConfigurationResponse
import br.com.zup.charles.domain.User
import br.com.zup.charles.domain.repository.GitConfigurationRepository
import br.com.zup.charles.domain.repository.UserRepository
import br.com.zup.exception.handler.exception.NotFoundException
import br.com.zup.exception.handler.to.ResourceValue
import javax.inject.Named

@Named
class CreateGitConfigurationInteractorImpl(
    private val gitConfigurationRepository: GitConfigurationRepository,
    private val userRepository: UserRepository
) :
    CreateGitConfigurationInteractor {

    override fun execute(request: CreateGitConfigurationRequest, applicationId: String): GitConfigurationResponse {
        val saved = this.gitConfigurationRepository.save(
            request.toGitConfiguration(applicationId, findAuthor(request.authorId))
        )

        return GitConfigurationResponse(saved.id, saved.name)
    }

    private fun findAuthor(authorId: String): User {
        return this.userRepository.findById(
            authorId
        ).orElseThrow {
            NotFoundException(
                ResourceValue("user", authorId)
            )
        }
    }
}