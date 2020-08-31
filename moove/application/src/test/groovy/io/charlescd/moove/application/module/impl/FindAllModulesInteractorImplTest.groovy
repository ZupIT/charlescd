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
import io.charlescd.moove.application.module.FindAllModulesInteractor
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.repository.ModuleRepository
import spock.lang.Specification

import java.time.LocalDateTime

class FindAllModulesInteractorImplTest extends Specification {

    private FindAllModulesInteractor findAllModulesInteractor

    private ModuleRepository moduleRepository = Mock(ModuleRepository)

    void setup() {
        findAllModulesInteractor = new FindAllModulesInteractorImpl(new ModuleService(moduleRepository))
    }

    def "should find all modules by workspace id"() {
        given:
        def workspaceId = "3579deba-bd15-4982-a82d-43f353f4fe7b"
        def pageRequest = new PageRequest(0, 10)

        def author = new User("81861b6f-2b6e-44a1-a745-83e298a550c9", "John Doe", "email@gmail.com",
                "https://www.photos.com/johndoe", [], false, LocalDateTime.now())

        def gitCredentials = new GitCredentials("address", "username", "password",
                null, GitServiceProvider.GITHUB)

        def gitConfiguration = new GitConfiguration("8f140b14-886d-4063-a245-eed09a1ff762", "config", gitCredentials,
                LocalDateTime.now(), author, workspaceId)

        def component = new Component("0e6fbc62-41e5-461a-ba11-1765b5d17776", "d4a89574-1ff0-4bf1-93e9-275a0036e48c", "component", LocalDateTime.now(),
                workspaceId, 10, 10, 'host',  'gateway', 'namespace')

        def module = new Module("d4a89574-1ff0-4bf1-93e9-275a0036e48c", "Villager", "gitRepositoryAddress",
                LocalDateTime.now(), "helm-repository", author,
                [], gitConfiguration, [component], workspaceId)

        when:
        def response = findAllModulesInteractor.execute(workspaceId, null, pageRequest)

        then:
        1 * moduleRepository.findByWorkspaceId(workspaceId, null, pageRequest) >> new Page<Module>([module], 0, 10, 1)

        assert response != null
        assert response.isLast
        assert response.totalPages == 1
        assert response.content.size() == 1
        assert response.content[0].id == module.id
        assert response.content[0].name == module.name
        assert response.content[0].createdAt == module.createdAt
        assert response.content[0].helmRepository == module.helmRepository
        assert response.content[0].gitRepositoryAddress == module.gitRepositoryAddress
        assert response.content[0].components.size() == 1
        assert response.content[0].components[0].id == component.id
        assert response.content[0].components[0].name == component.name
        assert response.content[0].components[0].createdAt == component.createdAt
        assert response.content[0].components[0].errorThreshold == component.errorThreshold
        assert response.content[0].components[0].latencyThreshold == component.latencyThreshold
    }

    def "should return an empty page when no modules were found"() {
        given:
        def workspaceId = "3579deba-bd15-4982-a82d-43f353f4fe7b"
        def pageRequest = new PageRequest(0, 10)

        when:
        def response = findAllModulesInteractor.execute(workspaceId, null, pageRequest)

        then:
        1 * moduleRepository.findByWorkspaceId(workspaceId, null, pageRequest) >> new Page<Module>([], 0, 10, 0)

        assert response != null
        assert response.content.size() == 0
        assert response.isLast
        assert response.totalPages == 1
    }
}
