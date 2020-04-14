/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.commons.integration.git.mapper

import br.com.zup.darwin.commons.constants.MooveErrorCode
import br.com.zup.darwin.commons.integration.git.service.GitServiceLegacy
import br.com.zup.darwin.entity.GitServiceProvider
import br.com.zup.exception.handler.exception.BusinessException
import org.springframework.stereotype.Component

@Component
class GitServiceMapperLegacy(private val serviceLegacies: List<GitServiceLegacy>) {

    fun getByType(serviceProvider: GitServiceProvider): GitServiceLegacy =
        serviceLegacies.find { s -> s.getProviderType() == serviceProvider }
            ?: throw BusinessException.of(MooveErrorCode.GIT_ERROR_PROVIDER_NOT_FOUND, serviceProvider.name)
}