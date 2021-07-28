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

package io.charlescd.moove.application

import io.charlescd.moove.domain.GitConfiguration
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.GitConfigurationRepository
import javax.inject.Named

@Named
class GitConfigurationService(private val gitConfigurationRepository: GitConfigurationRepository) {

    fun checkIfGitConfigurationExists(workspaceId: String, gitConfigurationId: String) {
        if (!this.gitConfigurationRepository.exists(workspaceId, gitConfigurationId)) {
            throw NotFoundException("gitConfigurationId", gitConfigurationId)
        }
    }

    fun find(gitConfigurationId: String): GitConfiguration {
        return this.gitConfigurationRepository.find(
            gitConfigurationId
        ).orElseThrow {
            NotFoundException("gitConfigurationId", gitConfigurationId)
        }
    }

    fun update(gitConfiguration: GitConfiguration): GitConfiguration {
        return this.gitConfigurationRepository.update(gitConfiguration)
    }
}
