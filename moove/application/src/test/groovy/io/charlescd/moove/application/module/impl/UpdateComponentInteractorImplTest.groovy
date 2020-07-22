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
import io.charlescd.moove.application.module.UpdateComponentInteractor
import io.charlescd.moove.application.module.request.ComponentRequest
import io.charlescd.moove.domain.Component
import io.charlescd.moove.domain.Module
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.ModuleRepository
import spock.lang.Specification

import java.time.LocalDateTime

class UpdateComponentInteractorImplTest extends Specification {

    private UpdateComponentInteractor updateComponentInteractor

    private ModuleRepository moduleRepository = Mock(ModuleRepository)

    void setup() {
        updateComponentInteractor = new UpdateComponentInteractorImpl(new ModuleService(moduleRepository))
    }

    def "should update a existing component"() {
        given:
        def moduleId = "module-id"
        def workspaceId = "workspace-id"
        def componentId = "component-id"
        def request = new ComponentRequest("new-component-name", 20, 20, 'host', 'gateway')

        def author = getDummyUser()

        def component = new Component(componentId, moduleId, "component-name", LocalDateTime.now(), workspaceId, 10, 10, 'host', 'gateway')
        def updatedComponent = new Component(componentId, moduleId, "new-component-name", LocalDateTime.now(), workspaceId, 20, 20, 'host', 'gateway')

        def module = new Module(moduleId, "module-name", "gitRepositoryAddress",
                LocalDateTime.now(), "helm-repository", author,
                [], null, [component], workspaceId)

        when:
        def response = updateComponentInteractor.execute(moduleId, componentId, workspaceId, request)

        then:
        1 * moduleRepository.find(moduleId, workspaceId) >> Optional.of(module)
        1 * moduleRepository.updateComponent(_) >> { arguments ->
            def componentToBeUpdated = arguments[0]

            assert componentToBeUpdated instanceof Component

            assert componentToBeUpdated.id == updatedComponent.id
            assert componentToBeUpdated.name == updatedComponent.name
            assert componentToBeUpdated.errorThreshold == updatedComponent.errorThreshold
            assert componentToBeUpdated.latencyThreshold == updatedComponent.latencyThreshold
        }

        assert response != null
        assert response.id == updatedComponent.id
        assert response.name == updatedComponent.name
        assert response.errorThreshold == updatedComponent.errorThreshold
        assert response.latencyThreshold == updatedComponent.latencyThreshold

        notThrown()
    }

    def "should throw not found exception when module does not exists"() {
        given:
        def moduleId = "module-not-found"
        def workspaceId = "workspace-id"
        def componentId = "component-id"
        def request = new ComponentRequest("new-component-name", 20, 20, 'host', 'gateway')

        when:
        updateComponentInteractor.execute(moduleId, componentId, workspaceId, request)

        then:
        1 * moduleRepository.find(moduleId, workspaceId) >> Optional.empty()
        0 * moduleRepository.updateComponent(_)

        def exception = thrown(NotFoundException)

        assert exception.resourceName == "module"
        assert exception.id == moduleId
    }

    def "should throw not found exception when component does not exists"() {
        given:
        def moduleId = "module-id"
        def workspaceId = "workspace-id"
        def componentId = "component-not-found"
        def request = new ComponentRequest("new-component-name", 20, 20, 'host', 'gateway')

        def author = getDummyUser()

        def component = new Component("component-id", moduleId, "component-name", LocalDateTime.now(), workspaceId, 10, 10, 'host', 'gateway')

        def module = new Module(moduleId, "module-name", "gitRepositoryAddress",
                LocalDateTime.now(), "helm-repository", author,
                [], null, [component], workspaceId)

        when:
        updateComponentInteractor.execute(moduleId, componentId, workspaceId, request)

        then:
        1 * moduleRepository.find(moduleId, workspaceId) >> Optional.of(module)
        0 * moduleRepository.updateComponent(_)

        def exception = thrown(NotFoundException)

        assert exception.resourceName == "component"
        assert exception.id == componentId
    }

    private User getDummyUser() {
        new User("81861b6f-2b6e-44a1-a745-83e298a550c9", "John Doe", "email@gmail.com",
                "https://www.photos.com/johndoe", [], false, LocalDateTime.now())
    }

}
