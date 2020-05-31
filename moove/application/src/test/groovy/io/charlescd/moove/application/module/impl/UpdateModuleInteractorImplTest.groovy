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
import io.charlescd.moove.application.module.UpdateModuleInteractor
import io.charlescd.moove.application.module.request.UpdateModuleRequest
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.ModuleRepository
import spock.lang.Specification

import java.time.LocalDateTime

class UpdateModuleInteractorImplTest extends Specification {

    private UpdateModuleInteractor updateModuleInteractor

    private ModuleRepository moduleRepository = Mock(ModuleRepository)

    void setup() {
        updateModuleInteractor = new UpdateModuleInteractorImpl(new ModuleService(moduleRepository))
    }

    def "should update a module"() {
        given:
        def moduleId = "76ba9b8d-6bd8-47f8-8834-cb970c3bf7b7"
        def workspaceId = "2b55d06d-4b8c-4f84-80a6-5b3337094370"
        def request = new UpdateModuleRequest("Application", "http://github.com.br",
                "http://github.com.br/repository")

        def author = new User("81861b6f-2b6e-44a1-a745-83e298a550c9", "John Doe", "email@gmail.com",
                "https://www.photos.com/johndoe", [], false, LocalDateTime.now())

        def gitCredentials = new GitCredentials("address", "username", "password",
                null, GitServiceProvider.GITHUB)

        def gitConfiguration = new GitConfiguration("8f140b14-886d-4063-a245-eed09a1ff762", "config", gitCredentials, LocalDateTime.now(), author, workspaceId)

        def component = new Component("0e6fbc62-41e5-461a-ba11-1765b5d17776", moduleId, "component", LocalDateTime.now(), workspaceId, 10, 10)

        def module = new Module(moduleId, "Villager", "gitRepositoryAddress",
                LocalDateTime.now(), "helm-repository", author,
                [], gitConfiguration, [component], workspaceId)

        when:
        def response = updateModuleInteractor.execute(moduleId, workspaceId, request)

        then:
        1 * moduleRepository.find(moduleId, workspaceId) >> Optional.of(module)
        1 * moduleRepository.update(_) >> { arguments ->
            def updatedModule = arguments[0]

            assert updatedModule instanceof Module
            assert updatedModule.name == request.name
            assert updatedModule.gitRepositoryAddress == request.gitRepositoryAddress
            assert updatedModule.helmRepository == request.helmRepository
            assert updatedModule.workspaceId == workspaceId
            assert updatedModule.id == moduleId

            return updatedModule
        }

        assert response != null
        assert response.id == moduleId
        assert response.createdAt == module.createdAt
        assert response.name == request.name
        assert response.gitRepositoryAddress == request.gitRepositoryAddress
        assert response.helmRepository == request.helmRepository
        assert response.components.size() == 1
    }

    def "should throw an exception when module does not exist"() {
        given:
        def moduleId = "76ba9b8d-6bd8-47f8-8834-cb970c3bf7b7"
        def workspaceId = "2b55d06d-4b8c-4f84-80a6-5b3337094370"
        def request = new UpdateModuleRequest("Application", "http://github.com.br",
                "http://github.com.br/repository")

        when:
        updateModuleInteractor.execute(moduleId, workspaceId, request)

        then:
        1 * moduleRepository.find(moduleId, workspaceId) >> Optional.empty()

        def exception = thrown(NotFoundException)
        assert exception.resourceName == "module"
        assert exception.id == moduleId
    }
}
