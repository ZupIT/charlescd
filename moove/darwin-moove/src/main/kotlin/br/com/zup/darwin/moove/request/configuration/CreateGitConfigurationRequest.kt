/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.request.configuration

import br.com.zup.darwin.entity.GitAuthType
import br.com.zup.darwin.entity.GitServiceProvider

data class CreateGitConfigurationRequest(
    val name: String,
    val address: String,
    val authType: GitAuthType,
    val username: String?,
    val password: String?,
    val accessToken: String?,
    val serviceProvider: GitServiceProvider,
    val authorId: String
)