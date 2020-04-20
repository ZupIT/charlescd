/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.application.configuration

import br.com.zup.charles.application.configuration.request.CreateGitConfigurationRequest
import br.com.zup.charles.application.configuration.response.GitConfigurationResponse

interface CreateGitConfigurationInteractor {

    fun execute(request: CreateGitConfigurationRequest, applicationId: String): GitConfigurationResponse
}