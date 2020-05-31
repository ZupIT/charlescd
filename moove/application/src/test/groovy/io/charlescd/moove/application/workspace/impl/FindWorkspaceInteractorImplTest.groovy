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

package io.charlescd.moove.application.workspace.impl

import io.charlescd.moove.application.*
import io.charlescd.moove.application.workspace.FindWorkspaceInteractor
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.GitConfigurationRepository
import io.charlescd.moove.domain.repository.MetricConfigurationRepository
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.repository.WorkspaceRepository
import io.charlescd.moove.domain.service.DeployService
import io.charlescd.moove.domain.service.VillagerService
import spock.lang.Specification

import java.time.LocalDateTime

class FindWorkspaceInteractorImplTest extends Specification {

    private FindWorkspaceInteractor getWorkspaceInteractor

    private UserRepository userRepository = Mock(UserRepository)
    private WorkspaceRepository workspaceRepository = Mock(WorkspaceRepository)
    private GitConfigurationRepository gitConfigurationRepository = Mock(GitConfigurationRepository)
    private VillagerService villagerService = Mock(VillagerService)
    private DeployService deployService = Mock(DeployService)
    private MetricConfigurationRepository metricConfigurationRepository = Mock(MetricConfigurationRepository)

    def setup() {
        this.getWorkspaceInteractor = new FindWorkspaceInteractorImpl(
                new WorkspaceService(workspaceRepository, userRepository),
                new GitConfigurationService(gitConfigurationRepository),
                new RegistryConfigurationService(villagerService),
                new CdConfigurationService(deployService),
                new MetricConfigurationService(metricConfigurationRepository)
        )
    }

    def 'when workspace does not exist should throw exception'() {
        given:
        def workspaceId = '0b3a34b7-5180-469c-a343-ce7705f97475'

        when:
        getWorkspaceInteractor.execute(workspaceId)

        then:
        1 * workspaceRepository.find(workspaceId) >> Optional.empty()

        def exception = thrown(NotFoundException)
        exception.resourceName == "workspace"
        exception.id == workspaceId
    }

    def 'when git configuration does not exist should throw exception'() {
        given:
        def author = getDummyUser()
        def workspace = new Workspace("309d992e-9d3c-4a32-aa78-e19471affd56", "Workspace Name", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.INCOMPLETE, null, null, "0b3a34b7-5180-469c-a343-ce7705f97475", null, null)

        when:
        getWorkspaceInteractor.execute(workspace.id)

        then:
        1 * workspaceRepository.find(workspace.id) >> Optional.of(workspace)
        1 * gitConfigurationRepository.find(workspace.gitConfigurationId) >> Optional.empty()

        def exception = thrown(NotFoundException)
        exception.resourceName == "gitConfigurationId"
        exception.id == workspace.gitConfigurationId
    }

    def 'when registry configuration does not exist should throw exception'() {
        given:
        def registryConfigurationId = "0000000d-9d3c-4a32-aa78-e19471affd56"
        def author = getDummyUser()
        def workspace = new Workspace("309d992e-9d3c-4a32-aa78-e19471affd56", "Workspace Name", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.INCOMPLETE, registryConfigurationId, null, null, null, null)

        when:
        getWorkspaceInteractor.execute(workspace.id)

        then:
        1 * workspaceRepository.find(workspace.id) >> Optional.of(workspace)
        0 * gitConfigurationRepository.find(workspace.gitConfigurationId) >> Optional.empty()
        1 * villagerService.findRegistryConfigurationNameById(registryConfigurationId, workspace.id) >> null

        def exception = thrown(NotFoundException)
        exception.resourceName == "registryConfigurationId"
        exception.id == registryConfigurationId
    }

    def 'when cd configuration does not exist should throw exception'() {
        given:
        def cdConfigurationId = "0000000d-9d3c-4a32-aa78-e19471affd56"
        def author = getDummyUser()
        def workspace = new Workspace("309d992e-9d3c-4a32-aa78-e19471affd56", "Workspace Name", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.INCOMPLETE, null, null, null, cdConfigurationId, null)

        when:
        getWorkspaceInteractor.execute(workspace.id)

        then:
        1 * workspaceRepository.find(workspace.id) >> Optional.of(workspace)
        0 * gitConfigurationRepository.find(workspace.gitConfigurationId) >> Optional.empty()
        0 * villagerService.findRegistryConfigurationNameById(cdConfigurationId, workspace.id)
        1 * deployService.getCdConfiguration(workspace.id, cdConfigurationId) >> null

        def exception = thrown(NotFoundException)
        exception.resourceName == "cdConfigurationId"
        exception.id == cdConfigurationId
    }

    def 'should return workspace information successfully'() {
        given:
        def circleMatcherUrl = "www.circle-matcher.url"
        def workspaceId = "309d992e-9d3c-4a32-aa78-e19471affd56"
        def cdConfigurationId = "309d992e-9d3c-4a32-aa78-e19471affd56"
        def registryConfigurationId = "0000000d-9d3c-4a32-aa78-e19471affd56"
        def registryConfigurationName = "Registry Test"

        def author = getDummyUser()
        def gitConfiguration = new GitConfiguration("0b3a34b7-5180-469c-a343-ce7705f97475", "git-configuration",
                new GitCredentials("addess", null, null, "access-token", GitServiceProvider.GITHUB),
                LocalDateTime.now(), author, workspaceId)
        def metricConfiguration = new MetricConfiguration("64f4174e-381d-4d08-a4ce-872ce6f78c01", MetricConfiguration.ProviderEnum.PROMETHEUS,
                "https://metric-provider-url.com.br", LocalDateTime.now(), workspaceId, author)
        def workspace = new Workspace(workspaceId, "Workspace Name", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.INCOMPLETE, registryConfigurationId, "www.circle-matcher.url", gitConfiguration.id, cdConfigurationId, metricConfiguration.id)
        def cdConfiguration = new CdConfiguration(cdConfigurationId, "cd-configuration-name")

        when:
        def response = getWorkspaceInteractor.execute(workspaceId)

        then:
        1 * workspaceRepository.find(workspace.id) >> Optional.of(workspace)
        1 * gitConfigurationRepository.find(workspace.gitConfigurationId) >> Optional.of(gitConfiguration)
        1 * villagerService.findRegistryConfigurationNameById(registryConfigurationId, workspaceId) >> registryConfigurationName
        1 * deployService.getCdConfiguration(workspaceId, cdConfigurationId) >> cdConfiguration
        1 * metricConfigurationRepository.find(metricConfiguration.id, workspaceId) >> Optional.of(metricConfiguration)

        response.id == workspace.id
        response.name == workspace.name
        response.status == workspace.status.name()
        response.authorId == workspace.author.id
        response.createdAt == workspace.createdAt
        response.gitConfiguration.id == workspace.gitConfigurationId
        response.gitConfiguration.name == gitConfiguration.name
        response.circleMatcherUrl == circleMatcherUrl
        response.registryConfiguration.id == registryConfigurationId
        response.registryConfiguration.name == registryConfigurationName
        response.cdConfiguration.id == cdConfiguration.id
        response.cdConfiguration.name == cdConfiguration.name
        response.metricConfiguration.id == metricConfiguration.id
        response.metricConfiguration.provider == metricConfiguration.provider.name()
    }

    private User getDummyUser() {
        new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<Workspace>(), false, LocalDateTime.now())
    }
}
