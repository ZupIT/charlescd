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
import io.charlescd.moove.application.SystemTokenService
import io.charlescd.moove.application.TestUtils
import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.build.response.ComponentResponse
import io.charlescd.moove.application.module.CreateModuleInteractor
import io.charlescd.moove.application.module.request.ComponentRequest
import io.charlescd.moove.application.module.request.CreateModuleRequest
import io.charlescd.moove.application.module.response.ModuleResponse
import io.charlescd.moove.domain.Module
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.repository.ModuleRepository
import io.charlescd.moove.domain.repository.SystemTokenRepository
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.repository.WorkspaceRepository
import io.charlescd.moove.domain.service.ManagementUserSecurityService
import spock.lang.Specification

class CreateModuleInteractorImplTest extends Specification {

    private CreateModuleInteractor createModuleInteractor

    private ModuleRepository moduleRepository = Mock(ModuleRepository)
    private UserRepository userRepository = Mock(UserRepository)
    private SystemTokenRepository systemTokenRepository = Mock(SystemTokenRepository)
    private WorkspaceRepository workspaceRepository = Mock(WorkspaceRepository)
    private SystemTokenService systemTokenService = new SystemTokenService(systemTokenRepository)
    private ManagementUserSecurityService managementUserSecurityService = Mock(ManagementUserSecurityService)

    void setup() {
        createModuleInteractor = new CreateModuleInteractorImpl(
                new ModuleService(moduleRepository),
                new UserService(userRepository, systemTokenService, managementUserSecurityService),
                new WorkspaceService(workspaceRepository, userRepository)
        )
    }

    def "should create a new module using authorization"() {
        given:
        def component = new ComponentRequest("Application", 10, 10, 'host', 'gateway')
        def authorization = TestUtils.authorization
        def workspaceId = TestUtils.workspaceId
        def request = new CreateModuleRequest("CharlesCD", "http://github.com.br",
                "http://github.com.br/helm", [component])

        def author = TestUtils.user

        def workspace = TestUtils.workspace
        when:
        def response = createModuleInteractor.execute(request, workspaceId, authorization, null)

        then:
        1 * moduleRepository.save(_) >> { arguments ->
            def module = arguments[0]

            assert module instanceof Module
            assert module.id != null
            assert module.name == request.name
            assert module.workspaceId == workspaceId
            assert module.helmRepository == request.helmRepository
            assert module.author.id == author.id

            return module
        }
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * userRepository.findByEmail(author.email) >> Optional.of(author)
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)

        assert response != null
        assert response instanceof ModuleResponse
        assert response.id != null
        assert response.name == request.name
        assert response.createdAt != null
        assert response.gitRepositoryAddress == request.gitRepositoryAddress
        assert response.components[0].id != null
        assert response.components[0] instanceof ComponentResponse
        assert response.components[0].name == request.components[0].name
        assert response.components[0].createdAt != null
    }

    def "should create a new module using system token"() {
        given:
        def component = new ComponentRequest("Application", 10, 10, 'host', 'gateway')
        def systemTokenValue = TestUtils.systemTokenValue
        def systemTokenId = TestUtils.systemTokenId
        def workspaceId = TestUtils.workspaceId
        def request = new CreateModuleRequest("CharlesCD", "http://github.com.br",
                "http://github.com.br/helm", [component])

        def author = TestUtils.user

        def workspace = TestUtils.workspace
        when:
        def response = createModuleInteractor.execute(request, workspaceId, null, systemTokenValue)

        then:
        1 * moduleRepository.save(_) >> { arguments ->
            def module = arguments[0]

            assert module instanceof Module
            assert module.id != null
            assert module.name == request.name
            assert module.workspaceId == workspaceId
            assert module.helmRepository == request.helmRepository
            assert module.author.id == author.id

            return module
        }
        1 * systemTokenRepository.getIdByTokenValue(systemTokenValue) >> systemTokenId
        1 * userRepository.findBySystemTokenId(systemTokenId) >> Optional.of(author)
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)

        assert response != null
        assert response instanceof ModuleResponse
        assert response.id != null
        assert response.name == request.name
        assert response.createdAt != null
        assert response.gitRepositoryAddress == request.gitRepositoryAddress
        assert response.components[0].id != null
        assert response.components[0] instanceof ComponentResponse
        assert response.components[0].name == request.components[0].name
        assert response.components[0].createdAt != null
    }

    def "when there are component with the same name, should return error"() {
        given:
        def component1 = new ComponentRequest("Application", 10, 10, 'host', 'gateway')
        def component2 = new ComponentRequest("Application", 10, 10, 'host', 'gateway')
        def authorization = TestUtils.authorization
        def workspaceId = TestUtils.workspaceId
        def request = new CreateModuleRequest("CharlesCD", "http://github.com.br",
                "http://github.com.br/helm", [component1, component2])

        def author = TestUtils.user

        when:
        createModuleInteractor.execute(request, workspaceId, authorization, null)

        then:
        0 * moduleRepository.save(_)
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * userRepository.findByEmail(author.email) >> Optional.of(author)
        0 * workspaceRepository.find(workspaceId)

        def exception = thrown(BusinessException)
        assert exception.message == "duplicated.component.name.error"
    }
}

