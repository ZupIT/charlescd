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

package io.charlescd.moove.application.configuration.impl

import io.charlescd.moove.application.DeploymentConfigurationService
import io.charlescd.moove.application.configuration.DeleteDeploymentConfigurationByIdInteractor
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.DeploymentConfigurationRepository
import spock.lang.Specification

class DeleteDeploymentConfigurationByIdInteractorImplTest extends Specification {

    private DeleteDeploymentConfigurationByIdInteractor interactor

    private DeploymentConfigurationRepository deploymentConfigurationRepository = Mock(DeploymentConfigurationRepository)

    def setup() {
        this.interactor = new DeleteDeploymentConfigurationByIdInteractorImpl(new DeploymentConfigurationService(deploymentConfigurationRepository))
    }

    def 'when deployment configuration id does not exist should throw exception'() {
        given:
        def deploymentConfigurationId = "4e806b2a-557b-45c5-91be-1e1db909bef6"
        def workspaceId = "00000000-557b-45c5-91be-1e1db909bef6"

        when:
        interactor.execute(workspaceId, deploymentConfigurationId)

        then:
        1 * deploymentConfigurationRepository.exists(workspaceId, deploymentConfigurationId) >> false

        def ex = thrown(NotFoundException)
        ex.resourceName == "deploymentConfigurationId"
        ex.id == deploymentConfigurationId
    }

    def 'should delete git configuration id successfully'() {
        given:
        def deploymentConfigurationId = "4e806b2a-557b-45c5-91be-1e1db909bef6"
        def workspaceId = "00000000-557b-45c5-91be-1e1db909bef6"

        when:
        interactor.execute(workspaceId, deploymentConfigurationId)

        then:
        1 * deploymentConfigurationRepository.exists(workspaceId, deploymentConfigurationId) >> true
        1 * deploymentConfigurationRepository.delete(deploymentConfigurationId)
    }
}
