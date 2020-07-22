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
import io.charlescd.moove.application.module.RemoveComponentInteractor
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.ModuleRepository
import spock.lang.Specification

import java.time.LocalDateTime

class RemoveComponentInteractorImplTest extends Specification {

    private RemoveComponentInteractor removeComponentInteractor

    private ModuleRepository moduleRepository = Mock(ModuleRepository)

    void setup() {
        removeComponentInteractor = new RemoveComponentInteractorImpl(new ModuleService(moduleRepository))
    }

    def "should remove only the component sent in the request from module"() {
        given:
        def moduleId = "e874aae3-d1a0-4334-879b-8687b3e638cd"
        def componentOneId = "be4dd50d-2446-4732-8812-bf2943e61008"
        def componentTwoId = "f474207d-69a2-468f-abd4-48542b72be8f"
        def workspaceId = "acbd47f7-17ca-4ace-90d4-79b6cbe69ba7"

        def author = getDummyUser()

        def gitCredentials = new GitCredentials("address", "username", "password",
                null, GitServiceProvider.GITHUB)

        def gitConfiguration = new GitConfiguration("8f140b14-886d-4063-a245-eed09a1ff762", "config", gitCredentials, LocalDateTime.now(), author, workspaceId)

        def componentOne = new Component(componentOneId, moduleId, "Application", LocalDateTime.now(), workspaceId, 10, 10, 'host', 'gateway')
        def componentTwo = new Component(componentTwoId, moduleId, "Batch-Application", LocalDateTime.now(), workspaceId, 10, 10, 'host', 'gateway')

        def module = new Module(moduleId, "CharlesCD", "gitRepositoryAddress",
                LocalDateTime.now(), "helm-repository", author,
                [], gitConfiguration, [componentOne, componentTwo], workspaceId)

        when:
        removeComponentInteractor.execute(moduleId, componentOneId, workspaceId)

        then:
        1 * moduleRepository.find(moduleId, workspaceId) >> Optional.of(module)

        1 * moduleRepository.removeComponents(_) >> { arguments ->
            def moduleArg = arguments[0]

            assert moduleArg instanceof Module
            assert moduleArg.id == module.id
            assert moduleArg.components.size() == 1
            assert moduleArg.components[0].id == componentOneId
        }
    }

    def "should throw an exception when component doest not exist"() {
        given:
        def moduleId = "e874aae3-d1a0-4334-879b-8687b3e638cd"
        def componentId = "be4dd50d-2446-4732-8812-bf2943e61008"
        def workspaceId = "acbd47f7-17ca-4ace-90d4-79b6cbe69ba7"

        def author = getDummyUser()

        def gitCredentials = new GitCredentials("address", "username", "password",
                null, GitServiceProvider.GITHUB)

        def gitConfiguration = new GitConfiguration("8f140b14-886d-4063-a245-eed09a1ff762", "config", gitCredentials, LocalDateTime.now(), author, workspaceId)

        def componentOne = new Component("afd9d0ae-a0f4-4b78-86b1-24baf1270e8c", moduleId, "Batch-Application", LocalDateTime.now(), workspaceId, 10, 10, 'host', 'gateway')

        def module = new Module(moduleId, "CharlesCD", "gitRepositoryAddress",
                LocalDateTime.now(), "helm-repository", author,
                [], gitConfiguration, [componentOne], workspaceId)

        when:
        removeComponentInteractor.execute(moduleId, componentId, workspaceId)

        then:
        1 * moduleRepository.find(moduleId, workspaceId) >> Optional.of(module)

        0 * moduleRepository.removeComponents(_) >> _

        def exception = thrown(NotFoundException)
        assert exception.resourceName == "component"
        assert exception.id == componentId
    }

    def "when module has just one component, should throw an exception"() {
        given:
        def moduleId = "e874aae3-d1a0-4334-879b-8687b3e638cd"
        def componentOneId = "be4dd50d-2446-4732-8812-bf2943e61008"
        def workspaceId = "acbd47f7-17ca-4ace-90d4-79b6cbe69ba7"

        def author = getDummyUser()

        def gitCredentials = new GitCredentials("address", "username", "password",
                null, GitServiceProvider.GITHUB)

        def gitConfiguration = new GitConfiguration("8f140b14-886d-4063-a245-eed09a1ff762", "config", gitCredentials, LocalDateTime.now(), author, workspaceId)

        def componentOne = new Component(componentOneId, moduleId, "Application", LocalDateTime.now(), workspaceId, 10, 10, 'host', 'gateway')

        def module = new Module(moduleId, "CharlesCD", "gitRepositoryAddress",
                LocalDateTime.now(), "helm-repository", author,
                [], gitConfiguration, [componentOne], workspaceId)

        when:
        removeComponentInteractor.execute(moduleId, componentOneId, workspaceId)

        then:
        1 * moduleRepository.find(moduleId, workspaceId) >> Optional.of(module)

        0 * moduleRepository.removeComponents(_) >> _

        def exception = thrown(BusinessException)
        assert exception.message == "module.must.have.at.least.one.component"
    }

    private User getDummyUser() {
        new User("81861b6f-2b6e-44a1-a745-83e298a550c9", "John Doe", "email@gmail.com",
                "https://www.photos.com/johndoe", [], false, LocalDateTime.now())
    }
}
