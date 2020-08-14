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
import io.charlescd.moove.application.module.AddComponentInteractor
import io.charlescd.moove.application.module.request.ComponentRequest
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.ModuleRepository
import org.springframework.dao.DuplicateKeyException
import spock.lang.Specification

import java.time.LocalDateTime

class AddComponentInteractorImplTest extends Specification {

    private AddComponentInteractor addComponentInteractor

    private ModuleRepository moduleRepository = Mock(ModuleRepository)

    void setup() {
        addComponentInteractor = new AddComponentInteractorImpl(new ModuleService(moduleRepository))
    }

    def "should add the component sent in the request"() {
        given:
        def moduleId = "ef5ea1ef-11a9-4f74-b95f-9944cc7390a1"
        def workspaceId = "038fed80-5565-4813-baa5-ae7ed6684159"
        def request = new ComponentRequest("Application", 10, 10, 'host', 'gateway')

        def author = getDummyUser()

        def gitCredentials = new GitCredentials("address", "username", "password",
                null, GitServiceProvider.GITHUB)

        def gitConfiguration = new GitConfiguration("8f140b14-886d-4063-a245-eed09a1ff762", "config", gitCredentials, LocalDateTime.now(), author, workspaceId)

        def component = new Component("0e6fbc62-41e5-461a-ba11-1765b5d17776", moduleId, "Villager", LocalDateTime.now(), workspaceId, 10, 10, 'host', 'gateway')

        def module = new Module(moduleId, "Villager", "gitRepositoryAddress",
                LocalDateTime.now(), "helm-repository", author,
                [], gitConfiguration, [component], workspaceId)

        when:
        def response = addComponentInteractor.execute(moduleId, workspaceId, request)

        then:
        1 * moduleRepository.find(moduleId, workspaceId) >> Optional.of(module)

        1 * moduleRepository.addComponents(_) >> { arguments ->
            def moduleArg = arguments[0]

            assert moduleArg instanceof Module
            assert moduleArg.id == moduleId
            assert moduleArg.components.size() == 1
            assert moduleArg.components[0].id != null
            assert moduleArg.components[0].name == request.name
            assert moduleArg.components[0].createdAt != null
            assert moduleArg.components[0].workspaceId == workspaceId
            assert moduleArg.components[0].moduleId == moduleId
            assert moduleArg.components[0].errorThreshold == request.errorThreshold
            assert moduleArg.components[0].latencyThreshold == request.latencyThreshold
        }

        assert response != null
        assert response.id != null
        assert response.createdAt != null
        assert response.name == "Application"
        assert response.errorThreshold == 10
        assert response.latencyThreshold == 10
    }


    def "should throw an exception when component already exists"() {
        given:
        def moduleId = "ef5ea1ef-11a9-4f74-b95f-9944cc7390a1"
        def workspaceId = "038fed80-5565-4813-baa5-ae7ed6684159"
        def request = new ComponentRequest("Application", 10, 10, 'host', 'gateway')

        def author = getDummyUser()

        def gitCredentials = new GitCredentials("address", "username", "password",
                null, GitServiceProvider.GITHUB)

        def gitConfiguration = new GitConfiguration("8f140b14-886d-4063-a245-eed09a1ff762", "config", gitCredentials, LocalDateTime.now(), author, workspaceId)

        def component = new Component("0e6fbc62-41e5-461a-ba11-1765b5d17776", moduleId, "Application", LocalDateTime.now(), workspaceId, 10, 10, 'host', 'gateway')

        def module = new Module(moduleId, "CharlesCD", "gitRepositoryAddress",
                LocalDateTime.now(), "helm-repository", author,
                [], gitConfiguration, [component], workspaceId)

        when:
        addComponentInteractor.execute(moduleId, workspaceId, request)

        then:
        1 * moduleRepository.find(moduleId, workspaceId) >> Optional.of(module)

        0 * moduleRepository.addComponents(_) >> _

        def exception = thrown(BusinessException)
        assert exception.message == "component.already.registered"
    }

    private User getDummyUser() {
        new User("81861b6f-2b6e-44a1-a745-83e298a550c9", "John Doe", "email@gmail.com",
                "https://www.photos.com/johndoe", [], false, LocalDateTime.now())
    }

    def "should throw an exception when module does not exists"() {
        given:
        def moduleId = "ef5ea1ef-11a9-4f74-b95f-9944cc7390a1"
        def workspaceId = "038fed80-5565-4813-baa5-ae7ed6684159"
        def request = new ComponentRequest("Application", 10, 10, 'host', 'gateway')

        when:
        addComponentInteractor.execute(moduleId, workspaceId, request)

        then:
        1 * moduleRepository.find(moduleId, workspaceId) >> Optional.empty()

        0 * moduleRepository.addComponents(_) >> _

        def exception = thrown(NotFoundException)
        assert exception.resourceName == "module"
        assert exception.id == moduleId
    }

    def "should throw an exception when component name already registered in workspace"() {
        given:
        def moduleId = "ef5ea1ef-11a9-4f74-b95f-9944cc7390a1"
        def workspaceId = "038fed80-5565-4813-baa5-ae7ed6684159"
        def request = new ComponentRequest("Application", 10, 10, 'host', 'gateway')

        def author = getDummyUser()

        def gitCredentials = new GitCredentials("address", "username", "password",
                null, GitServiceProvider.GITHUB)

        def gitConfiguration = new GitConfiguration("8f140b14-886d-4063-a245-eed09a1ff762", "config", gitCredentials, LocalDateTime.now(), author, workspaceId)

        def module = new Module(moduleId, "CharlesCD", "gitRepositoryAddress",
                LocalDateTime.now(), "helm-repository", author,
                [], gitConfiguration, [], workspaceId)

        when:
        addComponentInteractor.execute(moduleId, workspaceId, request)

        then:
        1 * moduleRepository.find(moduleId, workspaceId) >> Optional.of(module)

        1 * moduleRepository.addComponents(_) >> {
            throw new DuplicateKeyException("Unique constraint violation")
        }

        def exception = thrown(BusinessException)
        assert exception.message == "component.name.already.registered.in.workspace"
    }
}
