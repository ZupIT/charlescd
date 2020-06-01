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
import io.charlescd.moove.application.module.FindModuleByIdInteractor
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.ModuleRepository
import spock.lang.Specification

import java.time.LocalDateTime

class FindModuleByIdInteractorImplTest extends Specification {

    private FindModuleByIdInteractor findModuleByIdInteractor

    private ModuleRepository moduleRepository = Mock(ModuleRepository)

    void setup() {
        findModuleByIdInteractor = new FindModuleByIdInteractorImpl(new ModuleService(moduleRepository))
    }

    def "should return the module found"() {
        given:
        def moduleId = "3b56f483-1a28-42af-90a1-5415057dd09c"
        def workspaceId = "28144f48-f05d-4a19-b0d2-41bb661f2e60"

        def author = new User("81861b6f-2b6e-44a1-a745-83e298a550c9", "John Doe", "email@gmail.com",
                "https://www.photos.com/johndoe", [], false, LocalDateTime.now())

        def gitCredentials = new GitCredentials("address", "username", "password",
                null, GitServiceProvider.GITHUB)

        def gitConfiguration = new GitConfiguration("8f140b14-886d-4063-a245-eed09a1ff762", "config", gitCredentials,
                LocalDateTime.now(), author, workspaceId)

        def component = new Component("0e6fbc62-41e5-461a-ba11-1765b5d17776", moduleId, "component", LocalDateTime.now(),
                workspaceId, 10, 10)

        def module = new Module(moduleId, "Villager", "gitRepositoryAddress",
                LocalDateTime.now(), "helm-repository", author,
                [], gitConfiguration, [component], workspaceId)

        when:
        def response = findModuleByIdInteractor.execute(moduleId, workspaceId)

        then:
        1 * moduleRepository.find(moduleId, workspaceId) >> Optional.of(module)

        assert response != null
        assert response.id == module.id
        assert response.name == module.name
        assert response.createdAt == module.createdAt
        assert response.helmRepository == module.helmRepository
        assert response.gitRepositoryAddress == module.gitRepositoryAddress
        assert response.components.size() == 1
        assert response.components[0].id == component.id
        assert response.components[0].name == component.name
        assert response.components[0].createdAt == component.createdAt
        assert response.components[0].errorThreshold == component.errorThreshold
        assert response.components[0].latencyThreshold == component.latencyThreshold
    }

    def "should throw an exception when module does not exist"() {
        given:
        def moduleId = "3b56f483-1a28-42af-90a1-5415057dd09c"
        def workspaceId = "28144f48-f05d-4a19-b0d2-41bb661f2e60"

        when:
        findModuleByIdInteractor.execute(moduleId, workspaceId)

        then:
        1 * moduleRepository.find(moduleId, workspaceId) >> Optional.empty()

        def exception = thrown(NotFoundException)
        assert exception.resourceName == "module"
        assert exception.id == moduleId
    }
}
