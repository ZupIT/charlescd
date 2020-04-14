/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.domain

data class GitCredentials(
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
