/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.infrastructure.mapper

import br.com.zup.charles.domain.GitServiceProvider
import br.com.zup.charles.infrastructure.CharlesErrorCode
import br.com.zup.charles.domain.service.GitService
import br.com.zup.exception.handler.exception.BusinessException
import org.springframework.stereotype.Component

@Component
class GitServiceMapper(private val services: List<GitService>) {

    fun getByType(serviceProvider: GitServiceProvider): GitService =
        services.find { service -> service.getProviderType() == serviceProvider }
            ?: throw BusinessException.of(CharlesErrorCode.GIT_ERROR_PROVIDER_NOT_FOUND, serviceProvider.name)
}