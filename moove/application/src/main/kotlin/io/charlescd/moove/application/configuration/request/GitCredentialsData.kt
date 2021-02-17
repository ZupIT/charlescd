/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.charlescd.moove.application.configuration.request

import io.charlescd.moove.domain.GitCredentials
import io.charlescd.moove.domain.GitServiceProvider
import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull
import javax.validation.constraints.Size

data class GitCredentialsData(
    @field:NotBlank
    @field:Size(max = 2048)
    val address: String,
    @field:Size(max = 100)
    val username: String? = null,
    @field:Size(max = 100)
    val password: String? = null,
    @field:Size(max = 256)
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
