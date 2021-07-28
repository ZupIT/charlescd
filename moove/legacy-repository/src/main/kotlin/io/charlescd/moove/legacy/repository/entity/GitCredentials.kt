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

package io.charlescd.moove.legacy.repository.entity

import com.fasterxml.jackson.annotation.JsonIgnoreProperties

@JsonIgnoreProperties(ignoreUnknown = true)
class GitCredentials(
    val address: String,
    val username: String? = null,
    val password: String? = null,
    val accessToken: String? = null,
    val serviceProvider: GitServiceProvider
) {

    fun isValidOAuthToken(): Boolean {
        return !this.accessToken.isNullOrBlank()
    }

    fun isValidCredentials(): Boolean {
        return !this.username.isNullOrBlank() && !this.password.isNullOrBlank()
    }
}

enum class GitServiceProvider {
    GITHUB,
    GITLAB
}

enum class GitAuthType {
    LOGIN,
    TOKEN
}
