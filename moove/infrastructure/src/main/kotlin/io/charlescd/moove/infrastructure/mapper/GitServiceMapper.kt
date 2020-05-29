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

package io.charlescd.moove.infrastructure.mapper

import io.charlescd.moove.domain.GitServiceProvider
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.service.GitService
import org.springframework.stereotype.Component

@Component
class GitServiceMapper(private val services: List<GitService>) {

    fun getByType(serviceProvider: GitServiceProvider): GitService =
        services.find { service -> service.getProviderType() == serviceProvider }
            ?: throw BusinessException.of(MooveErrorCode.GIT_ERROR_PROVIDER_NOT_FOUND)
                .withParameters(serviceProvider.name)
}
