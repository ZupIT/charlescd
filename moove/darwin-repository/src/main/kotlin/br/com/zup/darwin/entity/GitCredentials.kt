/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.entity

import com.fasterxml.jackson.annotation.JsonIgnoreProperties

@JsonIgnoreProperties(ignoreUnknown = true)
class GitCredentials(
    val address: String,
    val username: String? = null,
    val password: String? = null,
    val accessToken: String? = null,
    val serviceProvider: GitServiceProvider
)

enum class GitServiceProvider {
    GITHUB,
    GITLAB
}

enum class GitAuthType {
    LOGIN,
    TOKEN
}