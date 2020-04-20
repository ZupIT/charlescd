/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.application.configuration.request

import br.com.zup.charles.domain.GitConfiguration
import br.com.zup.charles.domain.GitCredentials
import br.com.zup.charles.domain.GitServiceProvider
import br.com.zup.charles.domain.User
import java.time.LocalDateTime
import java.util.*
import javax.validation.Valid
import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull

data class CreateGitConfigurationRequest(
    @field:NotBlank
    val name: String,
    @field:NotBlank
    val authorId: String,
    @field:Valid
    val credentials: GitCredentialsPart
) {
    fun toGitConfiguration(applicationId: String, author: User) = GitConfiguration(
        id = UUID.randomUUID().toString(),
        name = name,
        author = author,
        applicationId = applicationId,
        createdAt = LocalDateTime.now(),
        credentials = credentials.toGitCredentials()
    )
}

data class GitCredentialsPart(
    @field:NotBlank
    val address: String,
    val username: String? = null,
    val password: String? = null,
    val accessToken: String? = null,
    @field:NotNull
    val serviceProvider: GitServiceProvider
) {
    fun toGitCredentials() = GitCredentials(
        address = address,
        username = username,
        password = password,
        accessToken = accessToken,
        serviceProvider = serviceProvider
    )
}

