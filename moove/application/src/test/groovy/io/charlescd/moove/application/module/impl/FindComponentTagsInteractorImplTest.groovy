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

package io.charlescd.moove.application.module.impl

import io.charlescd.moove.application.ModuleService
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.module.FindComponentTagsInteractor
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.repository.ModuleRepository
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.repository.WorkspaceRepository
import io.charlescd.moove.domain.service.VillagerService
import spock.lang.Specification

import java.time.LocalDateTime

class FindComponentTagsInteractorImplTest extends Specification {

    private FindComponentTagsInteractor findComponentTagsInteractor

    private UserRepository userRepository = Mock(UserRepository)
    private ModuleRepository moduleRepository = Mock(ModuleRepository)
    private WorkspaceRepository workspaceRepository = Mock(WorkspaceRepository)
    private VillagerService villagerService = Mock(VillagerService)

    void setup() {
        findComponentTagsInteractor = new FindComponentTagsInteractorImpl(
                new ModuleService(moduleRepository),
                new WorkspaceService(workspaceRepository, userRepository),
                villagerService
        )
    }

    def "should find all component tags"() {
        given:
        def moduleId = "4ea37c3c-9fe3-4b81-8950-58d2dccbf6da"
        def componentId = "181db65b-4b8f-4b05-8ca0-32c0429a541c"
        def workspaceId = "5f39caad-5b3c-404c-b035-1089ca10c68d"
        def tagName = "V-1.2.2"

        def author = getDummyUser()

        def gitCredentials = new GitCredentials("address", "username", "password",
                null, GitServiceProvider.GITHUB)

        def gitConfiguration = new GitConfiguration("8f140b14-886d-4063-a245-eed09a1ff762", "config", gitCredentials,
                LocalDateTime.now(), author, workspaceId)

        def component = new Component(componentId, moduleId, "component", LocalDateTime.now(),
                workspaceId, 10, 10)

        def module = new Module(moduleId, "CharlesCD", "gitRepositoryAddress",
                LocalDateTime.now(), "helm-repository", author,
                [], gitConfiguration, [component], workspaceId)

        def workspace = new Workspace(workspaceId, "Workspace Name", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.INCOMPLETE, "37549b0f-ae28-45ad-8189-dcb9b319705e", null,
                "0b3a34b7-5180-469c-a343-ce7705f97475", null, null)

        when:
        def response = findComponentTagsInteractor.execute(moduleId, componentId,tagName, workspaceId)

        then:
        1 * moduleRepository.find(moduleId, workspaceId) >> Optional.of(module)
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * villagerService.findComponentTags(_, _,_,_) >> { arguments ->
            def componentNameArg = arguments[0]
            def registryConfigurationIdArg = arguments[1]
            def componentTagNameArg = arguments[2]
            def workspaceIdArg = arguments[3]

            assert componentNameArg == component.name
            assert registryConfigurationIdArg == workspace.registryConfigurationId
            assert workspaceIdArg == workspace.id
            assert componentTagNameArg == tagName

            return [
                    new SimpleArtifact("component", "azure.acr/component:V-1.2.2"),
            ]
        }

        assert response != null
        assert response.size() == 1
        assert response[0].name == "component"
        assert response[0].artifact == "azure.acr/component:V-1.2.2"
    }

    def "should throw an exception when workspace registry configuration is missing"() {
        given:
        def moduleId = "4ea37c3c-9fe3-4b81-8950-58d2dccbf6da"
        def componentId = "181db65b-4b8f-4b05-8ca0-32c0429a541c"
        def workspaceId = "5f39caad-5b3c-404c-b035-1089ca10c68d"
        def tagName = "V-1.2.2"

        def author = getDummyUser()

        def workspace = new Workspace(workspaceId, "Workspace Name", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.INCOMPLETE, null, null, "0b3a34b7-5180-469c-a343-ce7705f97475", null, null)

        when:
        findComponentTagsInteractor.execute(moduleId, componentId,tagName, workspaceId)

        then:
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        0 * villagerService.findComponentTags(_, _, _) >> _
        0 * moduleRepository.find(moduleId, workspaceId) >> _

        def exception = thrown(BusinessException)
        assert exception.message == "workspace.docker.registry.configuration.is.missing"
    }

    private User getDummyUser() {
        new User("81861b6f-2b6e-44a1-a745-83e298a550c9", "John Doe", "email@gmail.com",
                "https://www.photos.com/johndoe", [], false, LocalDateTime.now())
    }
}
