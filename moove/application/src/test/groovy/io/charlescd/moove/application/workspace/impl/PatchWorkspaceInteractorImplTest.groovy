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
import io.charlescd.moove.application.workspace.PatchWorkspaceInteractor
import io.charlescd.moove.application.workspace.request.PatchWorkspaceRequest
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.*
import io.charlescd.moove.domain.service.CircleMatcherService
import io.charlescd.moove.domain.service.DeployService
import io.charlescd.moove.domain.service.VillagerService
import spock.lang.Specification

import java.time.LocalDateTime

class PatchWorkspaceInteractorImplTest extends Specification {
    private PatchWorkspaceInteractor interactor

    private UserRepository userRepository = Mock(UserRepository)
    private GitConfigurationRepository gitConfigurationRepository = Mock(GitConfigurationRepository)
    private WorkspaceRepository workspaceRepository = Mock(WorkspaceRepository)
    private DeployService deployService = Mock(DeployService)
    private VillagerService villagerService = Mock(VillagerService)
    private CircleMatcherService circleMatcherService = Mock(CircleMatcherService)
    private CircleRepository circleRepository = Mock(CircleRepository)
    private MetricConfigurationRepository metricConfigurationRepository = Mock(MetricConfigurationRepository)

    def setup() {
        interactor = new PatchWorkspaceInteractorImpl(
                new GitConfigurationService(gitConfigurationRepository),
                new CdConfigurationService(deployService),
                new WorkspaceService(workspaceRepository, userRepository),
                new RegistryConfigurationService(villagerService),
                new MetricConfigurationService(metricConfigurationRepository),
                circleMatcherService,
                new CircleService(circleRepository)
        )
    }

    def 'when workspace does not exist, should throw exception'() {
        given:
        def workspaceId = "309d992e-9d3c-4a32-aa78-e19471affd56"
        def request = new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.REPLACE, "/name", "Testing")])

        when:
        interactor.execute(workspaceId, request)

        then:
        1 * workspaceRepository.find(workspaceId) >> Optional.empty()
        0 * gitConfigurationRepository.exists(_, _)
        0 * workspaceRepository.update(_)

        def ex = thrown(NotFoundException)
        ex.resourceName == "workspace"
        ex.id == workspaceId
    }

    def 'when git configuration does not exist on the database, should throw exception'() {
        given:
        def gitConfigurationId = "e6128936-3fb2-4d10-9264-4ac63b689e56"
        def author = getDummyUser()
        def workspace = new Workspace("309d992e-9d3c-4a32-aa78-e19471affd56", "Workspace Name", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.INCOMPLETE, null, null, null, null, null)

        def request = new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.REPLACE, "/gitConfigurationId", gitConfigurationId)])

        when:
        interactor.execute(workspace.id, request)

        then:
        1 * workspaceRepository.find(workspace.id) >> Optional.of(workspace)
        1 * gitConfigurationRepository.exists(workspace.id, gitConfigurationId) >> false
        0 * workspaceRepository.update(_)

        def ex = thrown(NotFoundException)
        ex.resourceName == "gitConfigurationId"
        ex.id == gitConfigurationId
    }

    def 'when replacing git configuration id, should patch information successfully'() {
        given:
        def newGitConfigurationId = "ba7006e0-a653-46dd-90be-71a0987f548a"
        def author = getDummyUser()
        def workspace = new Workspace("309d992e-9d3c-4a32-aa78-e19471affd56", "Workspace Name", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.INCOMPLETE, null, null, null, null, null)
        def request = new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.REPLACE, "/gitConfigurationId", newGitConfigurationId)])

        when:
        interactor.execute(workspace.id, request)

        then:
        1 * workspaceRepository.find(workspace.id) >> Optional.of(workspace)
        1 * gitConfigurationRepository.exists(workspace.id, newGitConfigurationId) >> true
        1 * workspaceRepository.update(_) >> { arguments ->
            def workspaceUpdated = arguments[0]
            workspaceUpdated instanceof Workspace

            assert workspaceUpdated.id == workspace.id
            assert workspaceUpdated.name == workspace.name
            assert workspaceUpdated.author == workspace.author
            assert workspaceUpdated.status == workspace.status
            assert workspaceUpdated.gitConfigurationId != workspace.gitConfigurationId
            assert workspaceUpdated.gitConfigurationId == newGitConfigurationId
        }
    }

    def 'when replacing registry configuration id, should patch information successfully'() {
        given:
        def newRegistryConfigurationId = "ba7006e0-a653-46dd-90be-71a0987f548a"
        def author = getDummyUser()
        def workspace = new Workspace("309d992e-9d3c-4a32-aa78-e19471affd56", "Workspace Name", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.INCOMPLETE, null, null, null, null, null)
        def request = new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.REPLACE, "/registryConfigurationId", newRegistryConfigurationId)])

        when:
        interactor.execute(workspace.id, request)

        then:
        1 * workspaceRepository.find(workspace.id) >> Optional.of(workspace)
        0 * gitConfigurationRepository.exists(workspace.id, _)
        1 * villagerService.checkIfRegistryConfigurationExists(newRegistryConfigurationId, workspace.id) >> true
        1 * workspaceRepository.update(_) >> { arguments ->
            def workspaceUpdated = arguments[0]
            workspaceUpdated instanceof Workspace

            assert workspaceUpdated.id == workspace.id
            assert workspaceUpdated.name == workspace.name
            assert workspaceUpdated.author == workspace.author
            assert workspaceUpdated.status == workspace.status
            assert workspaceUpdated.gitConfigurationId == workspace.gitConfigurationId
            assert workspaceUpdated.registryConfigurationId != workspace.registryConfigurationId
            assert workspaceUpdated.registryConfigurationId == newRegistryConfigurationId
        }
    }

    def 'when replacing CD configuration id, should patch information successfully'() {
        given:
        def newCdConfigurationId = "ba7006e0-a653-46dd-90be-71a0987f548a"
        def author = getDummyUser()
        def workspace = new Workspace("309d992e-9d3c-4a32-aa78-e19471affd56", "Workspace Name", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.INCOMPLETE, null, null, null, null, null)
        def cdConfiguration = new CdConfiguration(newCdConfigurationId, "name")
        def request = new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.REPLACE, "/cdConfigurationId", newCdConfigurationId)])

        when:
        interactor.execute(workspace.id, request)

        then:
        1 * workspaceRepository.find(workspace.id) >> Optional.of(workspace)
        0 * gitConfigurationRepository.exists(workspace.id, _)
        0 * villagerService.checkIfRegistryConfigurationExists(newCdConfigurationId, workspace.id)
        1 * deployService.getCdConfiguration(workspace.id, newCdConfigurationId) >> cdConfiguration
        1 * workspaceRepository.update(_) >> { arguments ->
            def workspaceUpdated = arguments[0]
            workspaceUpdated instanceof Workspace

            assert workspaceUpdated.id == workspace.id
            assert workspaceUpdated.name == workspace.name
            assert workspaceUpdated.author == workspace.author
            assert workspaceUpdated.status == workspace.status
            assert workspaceUpdated.gitConfigurationId == workspace.gitConfigurationId
            assert workspaceUpdated.registryConfigurationId == workspace.gitConfigurationId
            assert workspaceUpdated.cdConfigurationId == newCdConfigurationId
        }
    }

    def 'when cd configuration id does not exist, should throw exception'() {
        given:
        def cdConfigurationId = "e6128936-3fb2-4d10-9264-4ac63b689e56"
        def author = getDummyUser()
        def workspace = new Workspace("309d992e-9d3c-4a32-aa78-e19471affd56", "Workspace Name", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.INCOMPLETE, null, null, null, null, null)

        def request = new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.REPLACE, "/cdConfigurationId", cdConfigurationId)])

        when:
        interactor.execute(workspace.id, request)

        then:
        1 * workspaceRepository.find(workspace.id) >> Optional.of(workspace)
        0 * gitConfigurationRepository.exists(workspace.id, _)
        0 * villagerService.checkIfRegistryConfigurationExists(cdConfigurationId, workspace.id)
        0 * workspaceRepository.update(_)
        1 * deployService.getCdConfiguration(workspace.id, cdConfigurationId) >> null

        def ex = thrown(NotFoundException)
        ex.resourceName == "cdConfigurationId"
        ex.id == cdConfigurationId
    }

    def 'when registry configuration id does not exist, should throw exception'() {
        given:
        def registryConfigurationId = "e6128936-3fb2-4d10-9264-4ac63b689e56"
        def author = getDummyUser()
        def workspace = new Workspace("309d992e-9d3c-4a32-aa78-e19471affd56", "Workspace Name", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.INCOMPLETE, null, null, null, null, null)

        def request = new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.REPLACE, "/registryConfigurationId", registryConfigurationId)])

        when:
        interactor.execute(workspace.id, request)

        then:
        1 * workspaceRepository.find(workspace.id) >> Optional.of(workspace)
        0 * gitConfigurationRepository.exists(workspace.id, _)
        1 * villagerService.checkIfRegistryConfigurationExists(registryConfigurationId, workspace.id)
        0 * workspaceRepository.update(_)

        def ex = thrown(NotFoundException)
        ex.resourceName == "registryConfigurationId"
        ex.id == registryConfigurationId
    }

    def 'when replacing circle matcher url, should patch information successfully'() {
        given:
        def newCircleMatcherUrl = "https://new-circle-matcher-url.com.br"
        def author = getDummyUser()
        def workspace = new Workspace("309d992e-9d3c-4a32-aa78-e19471affd56", "Workspace Name", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.INCOMPLETE, null, null, null, null, null)

        def request = new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.REPLACE, "/circleMatcherUrl", newCircleMatcherUrl)])
        def circle = new Circle("0121983as-557b-45c5-91be-1e1db909bef6", "Default", "reference", author, LocalDateTime.now(),
                MatcherTypeEnum.REGULAR, null, null, null, true, workspace.id)

        when:
        interactor.execute(workspace.id, request)

        then:
        1 * workspaceRepository.find(workspace.id) >> Optional.of(workspace)
        0 * gitConfigurationRepository.exists(workspace.id, _)
        0 * villagerService.checkIfRegistryConfigurationExists(newCircleMatcherUrl, workspace.id)
        1 * circleRepository.findDefaultByWorkspaceId(workspace.id) >> Optional.of(circle)
        1 * circleMatcherService.create(circle, newCircleMatcherUrl)
        1 * workspaceRepository.update(_) >> { arguments ->
            def workspaceUpdated = arguments[0]
            workspaceUpdated instanceof Workspace

            assert workspaceUpdated.id == workspace.id
            assert workspaceUpdated.name == workspace.name
            assert workspaceUpdated.userGroups == workspace.userGroups
            assert workspaceUpdated.author == workspace.author
            assert workspaceUpdated.status == workspace.status
            assert workspaceUpdated.gitConfigurationId == workspace.gitConfigurationId
            assert workspaceUpdated.registryConfigurationId == workspace.registryConfigurationId
            assert workspaceUpdated.circleMatcherUrl == newCircleMatcherUrl
        }
    }

    def 'when patching the same circle matcher url, should not create a new default circle at circle matcher'() {
        given:
        def circleMatcherUrl = "https://new-circle-matcher-url.com.br"
        def author = getDummyUser()
        def workspace = new Workspace("309d992e-9d3c-4a32-aa78-e19471affd56", "Workspace Name", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.INCOMPLETE, null, "https://old-circle-matcher-url.com.br", null, null, null)
        def request = new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.REPLACE, "/circleMatcherUrl", circleMatcherUrl)])
        def circle = new Circle("0121983as-557b-45c5-91be-1e1db909bef6", "Default", "reference", author, LocalDateTime.now(),
                MatcherTypeEnum.REGULAR, null, null, null, true, workspace.id)

        when:
        interactor.execute(workspace.id, request)

        then:
        1 * workspaceRepository.find(workspace.id) >> Optional.of(workspace)
        0 * gitConfigurationRepository.exists(workspace.id, _)
        0 * villagerService.checkIfRegistryConfigurationExists(circleMatcherUrl, workspace.id)
        1 * circleMatcherService.create(circle, circleMatcherUrl)
        1 * circleRepository.findDefaultByWorkspaceId(workspace.id) >> Optional.of(circle)
        1 * workspaceRepository.update(_) >> { arguments ->
            def workspaceUpdated = arguments[0]
            workspaceUpdated instanceof Workspace

            assert workspaceUpdated.id == workspace.id
            assert workspaceUpdated.name == workspace.name
            assert workspaceUpdated.userGroups == workspace.userGroups
            assert workspaceUpdated.author == workspace.author
            assert workspaceUpdated.status == workspace.status
            assert workspaceUpdated.gitConfigurationId == workspace.gitConfigurationId
            assert workspaceUpdated.registryConfigurationId == workspace.registryConfigurationId
            assert workspaceUpdated.circleMatcherUrl == circleMatcherUrl
        }
    }

    def 'when metric configuration id does not exist, should throw exception'() {
        given:
        def metricConfigurationId = "e6128936-3fb2-4d10-9264-4ac63b689e56"
        def author = getDummyUser()
        def workspace = new Workspace("309d992e-9d3c-4a32-aa78-e19471affd56", "Workspace Name", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.INCOMPLETE, null, null, null, null, null)

        def request = new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.REPLACE, "/metricConfigurationId", metricConfigurationId)])

        when:
        interactor.execute(workspace.id, request)

        then:
        1 * workspaceRepository.find(workspace.id) >> Optional.of(workspace)
        0 * gitConfigurationRepository.exists(workspace.id, _)
        0 * villagerService.checkIfRegistryConfigurationExists(metricConfigurationId, workspace.id)
        1 * metricConfigurationRepository.exists(metricConfigurationId, workspace.id) >> false
        0 * workspaceRepository.update(_)

        def ex = thrown(NotFoundException)
        ex.resourceName == "metricConfiguration"
        ex.id == metricConfigurationId
    }

    def 'when replacing metric configuration id, should patch information successfully'() {
        given:
        def metricConfigurationId = "ba7006e0-a653-46dd-90be-71a0987f548a"
        def author = getDummyUser()
        def workspace = new Workspace("309d992e-9d3c-4a32-aa78-e19471affd56", "Workspace Name", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.INCOMPLETE, null, null, null, null, null)
        def request = new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.REPLACE, "/metricConfigurationId", metricConfigurationId)])

        when:
        interactor.execute(workspace.id, request)

        then:
        1 * workspaceRepository.find(workspace.id) >> Optional.of(workspace)
        0 * gitConfigurationRepository.exists(workspace.id, _)
        0 * villagerService.checkIfRegistryConfigurationExists(metricConfigurationId, workspace.id)
        0 * deployService.getCdConfiguration(workspace.id, metricConfigurationId)
        1 * metricConfigurationRepository.exists(metricConfigurationId, workspace.id) >> true
        1 * workspaceRepository.update(_) >> { arguments ->
            def workspaceUpdated = arguments[0]
            workspaceUpdated instanceof Workspace

            assert workspaceUpdated.id == workspace.id
            assert workspaceUpdated.name == workspace.name
            assert workspaceUpdated.author == workspace.author
            assert workspaceUpdated.status == workspace.status
            assert workspaceUpdated.gitConfigurationId == workspace.gitConfigurationId
            assert workspaceUpdated.registryConfigurationId == workspace.registryConfigurationId
            assert workspaceUpdated.cdConfigurationId == workspace.cdConfigurationId
            assert workspaceUpdated.metricConfigurationId == metricConfigurationId
        }
    }

    def 'when all the configurations are filled, should change the status to complete'() {
        given:
        def metricConfigurationId = "ba7006e0-a653-46dd-90be-71a0987f548a"
        def author = getDummyUser()
        def workspace = new Workspace("309d992e-9d3c-4a32-aa78-e19471affd56", "Workspace Name", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.INCOMPLETE, "registryConfigurationId", "https://circle-matcher.com.br",
                "gitConfigurationId", "cdConfigurationId", "metricConfigurationId")
        def request = new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.REPLACE, "/metricConfigurationId", metricConfigurationId)])

        when:
        interactor.execute(workspace.id, request)

        then:
        1 * workspaceRepository.find(workspace.id) >> Optional.of(workspace)
        0 * gitConfigurationRepository.exists(workspace.id, workspace.gitConfigurationId)
        0 * villagerService.checkIfRegistryConfigurationExists(workspace.registryConfigurationId, workspace.id)
        0 * deployService.getCdConfiguration(workspace.id, workspace.cdConfigurationId)
        1 * metricConfigurationRepository.exists(metricConfigurationId, workspace.id) >> true
        1 * workspaceRepository.update(_) >> { arguments ->
            def workspaceUpdated = arguments[0]
            workspaceUpdated instanceof Workspace

            assert workspaceUpdated.id == workspace.id
            assert workspaceUpdated.name == workspace.name
            assert workspaceUpdated.author == workspace.author
            assert workspaceUpdated.gitConfigurationId == workspace.gitConfigurationId
            assert workspaceUpdated.registryConfigurationId == workspace.registryConfigurationId
            assert workspaceUpdated.cdConfigurationId == workspace.cdConfigurationId
            assert workspaceUpdated.metricConfigurationId == metricConfigurationId
            assert workspaceUpdated.status == WorkspaceStatusEnum.COMPLETE
        }
    }

    def 'when replacing circle matcher url, if circle does not exist should throw exception'() {
        given:
        def newCircleMatcherUrl = "https://new-circle-matcher-url.com.br"
        def author = getDummyUser()
        def workspace = new Workspace("309d992e-9d3c-4a32-aa78-e19471affd56", "Workspace Name", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.INCOMPLETE, null, null, null, null, null)

        def request = new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.REPLACE, "/circleMatcherUrl", newCircleMatcherUrl)])
        def circle = new Circle("0121983as-557b-45c5-91be-1e1db909bef6", "Default", "reference", author, LocalDateTime.now(),
                MatcherTypeEnum.REGULAR, null, null, null, true, workspace.id)

        when:
        interactor.execute(workspace.id, request)

        then:
        1 * workspaceRepository.find(workspace.id) >> Optional.of(workspace)
        0 * gitConfigurationRepository.exists(workspace.id, _)
        0 * villagerService.checkIfRegistryConfigurationExists(newCircleMatcherUrl, workspace.id)
        1 * circleRepository.findDefaultByWorkspaceId(workspace.id) >> Optional.empty()
        0 * circleMatcherService.create(circle, newCircleMatcherUrl)
        0 * workspaceRepository.update(_)

        thrown(BusinessException)
    }

    def 'when patching the same circle matcher url, if an error happens when calling circle matcher should throw exception'() {
        given:
        def circleMatcherUrl = "https://new-circle-matcher-url.com.br"
        def author = getDummyUser()
        def workspace = new Workspace("309d992e-9d3c-4a32-aa78-e19471affd56", "Workspace Name", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.INCOMPLETE, null, "https://old-circle-matcher-url.com.br", null, null, null)
        def request = new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.REPLACE, "/circleMatcherUrl", circleMatcherUrl)])
        def circle = new Circle("0121983as-557b-45c5-91be-1e1db909bef6", "Default", "reference", author, LocalDateTime.now(),
                MatcherTypeEnum.REGULAR, null, null, null, true, workspace.id)

        when:
        interactor.execute(workspace.id, request)

        then:
        1 * workspaceRepository.find(workspace.id) >> Optional.of(workspace)
        0 * gitConfigurationRepository.exists(workspace.id, _)
        0 * villagerService.checkIfRegistryConfigurationExists(circleMatcherUrl, workspace.id)
        1 * circleRepository.findDefaultByWorkspaceId(workspace.id) >> Optional.of(circle)
        1 * circleMatcherService.create(circle, circleMatcherUrl) >> { arguments ->
            throw new NotFoundException()
        }
        0 * workspaceRepository.update(_)

        thrown(BusinessException)
    }

    private User getDummyUser() {
        new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<Workspace>(), false, LocalDateTime.now())
    }

}
