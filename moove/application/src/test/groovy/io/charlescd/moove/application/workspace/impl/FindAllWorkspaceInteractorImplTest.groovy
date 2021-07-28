/*
 * Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

package io.charlescd.moove.application.workspace.impl

import io.charlescd.moove.application.DeploymentConfigurationService
import io.charlescd.moove.application.TestUtils
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.workspace.FindAllWorkspaceInteractor
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.repository.DeploymentConfigurationRepository
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.repository.WorkspaceRepository
import spock.lang.Specification

class FindAllWorkspaceInteractorImplTest extends Specification {

    private FindAllWorkspaceInteractor findAllWorkspaceInteractor

    private UserRepository userRepository = Mock(UserRepository)
    private DeploymentConfigurationRepository deploymentConfigurationRepository = Mock(DeploymentConfigurationRepository)
    private WorkspaceRepository workspaceRepository = Mock(WorkspaceRepository)

    def setup() {
        this.findAllWorkspaceInteractor = new FindAllWorkspaceInteractorImpl(
                new WorkspaceService(workspaceRepository, userRepository),
                new DeploymentConfigurationService(deploymentConfigurationRepository)
        )
    }

    def "when there is no workspaces should return an empty page"() {
        given:
        def pageRequest = new PageRequest()
        def emptyPage = new Page([], 0, 20, 0)

        when:
        def response = this.findAllWorkspaceInteractor.execute(pageRequest, null)

        then:
        1 * this.workspaceRepository.find(_, null) >> { arguments ->
            def argPageRequest = arguments[0]

            assert argPageRequest instanceof PageRequest

            return emptyPage
        }


        assert response != null
        assert response.page == 0
        assert response.size == 0
        assert response.content.size() == 0
        assert response.totalPages == 1
        assert response.isLast
    }

    def "when there are workspaces without configuration, should list them"() {
        given:
        def pageRequest = new PageRequest()
        def workspace = new SimpleWorkspace("workspace-id", "workspace-name", new SimpleAuthor("teste@teste.com"), WorkspaceStatusEnum.INCOMPLETE, null)
        def page = new Page([workspace], 0, 20, 1)

        when:
        def response = this.findAllWorkspaceInteractor.execute(pageRequest, null)

        then:
        1 * this.workspaceRepository.find(_, null) >> { arguments ->
            def argPageRequest = arguments[0]

            assert argPageRequest instanceof PageRequest

            return page
        }
        0 * this.deploymentConfigurationRepository.find(_)

        assert response != null
        assert response.page == 0
        assert response.size == 1
        assert response.content.size() == 1
        assert response.content[0].id == workspace.id
        assert response.content[0].name == workspace.name
        assert response.content[0].status == workspace.status.toString()
    }

    def "when there are workspaces with configuration, should list them"() {
        given:
        def deploymentConfigurationId = TestUtils.deploymentConfigId
        def deploymentConfiguration = TestUtils.deploymentConfig
        def pageRequest = new PageRequest()
        def workspace = new SimpleWorkspace(TestUtils.workspaceId, "workspace-name", new SimpleAuthor("teste@teste.com"), WorkspaceStatusEnum.INCOMPLETE, deploymentConfigurationId)
        def page = new Page([workspace], 0, 20, 1)

        when:
        def response = this.findAllWorkspaceInteractor.execute(pageRequest, null)

        then:
        1 * this.workspaceRepository.find(_, null) >> { arguments ->
            def argPageRequest = arguments[0]

            assert argPageRequest instanceof PageRequest

            return page
        }
        1 * this.deploymentConfigurationRepository.find(workspace.deploymentConfigurationId) >> Optional.of(deploymentConfiguration)

        assert response != null
        assert response.page == 0
        assert response.size == 1
        assert response.content.size() == 1
        assert response.content[0].id == workspace.id
        assert response.content[0].name == workspace.name
        assert response.content[0].status == workspace.status.toString()
        assert response.content[0].deploymentConfiguration != null
        assert response.content[0].deploymentConfiguration.id == deploymentConfiguration.id
        assert response.content[0].deploymentConfiguration.name == deploymentConfiguration.name
        assert response.content[0].deploymentConfiguration.gitProvider == deploymentConfiguration.gitProvider
    }

}
