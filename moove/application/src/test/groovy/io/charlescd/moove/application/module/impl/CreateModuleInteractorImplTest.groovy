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
import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.build.response.ComponentResponse
import io.charlescd.moove.application.module.CreateModuleInteractor
import io.charlescd.moove.application.module.request.ComponentRequest
import io.charlescd.moove.application.module.request.CreateModuleRequest
import io.charlescd.moove.application.module.response.ModuleResponse
import io.charlescd.moove.domain.Module
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.Workspace
import io.charlescd.moove.domain.WorkspaceStatusEnum
import io.charlescd.moove.domain.repository.ModuleRepository
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.repository.WorkspaceRepository
import spock.lang.Specification

import java.time.LocalDateTime

class CreateModuleInteractorImplTest extends Specification {

    private CreateModuleInteractor createModuleInteractor

    private ModuleRepository moduleRepository = Mock(ModuleRepository)
    private UserRepository userRepository = Mock(UserRepository)
    private WorkspaceRepository workspaceRepository = Mock(WorkspaceRepository)

    void setup() {
        createModuleInteractor = new CreateModuleInteractorImpl(
                new ModuleService(moduleRepository),
                new UserService(userRepository),
                new WorkspaceService(workspaceRepository, userRepository)
        )
    }

    def "should create a new module"() {
        given:
        def component = new ComponentRequest("Application", 10, 10, 'host', 'gateway', 'namespace')

        def workspaceId = "de891f75-6c8b-4bc3-89c7-d2d58942d404"
        def authorId = "cf3a837e-4b19-474f-95c8-7ba6ba4b3b28"
        def request = new CreateModuleRequest("CharlesCD", "http://github.com.br",
                "http://github.com.br/helm", authorId, [component])

        def author = new User(authorId, "zup", "zup@zup.com.br", "http://image.com.br/photo.png",
                [], false, LocalDateTime.now())

        def workspace = new Workspace(workspaceId, "CharlesCD", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, null, "http://matcher.com.br", null, null, null)

        when:
        def response = createModuleInteractor.execute(request, workspaceId)

        then:
        1 * moduleRepository.save(_) >> { arguments ->
            def module = arguments[0]

            assert module instanceof Module
            assert module.id != null
            assert module.name == request.name
            assert module.workspaceId == workspaceId
            assert module.helmRepository == request.helmRepository
            assert module.author.id == request.authorId

            return module
        }
        1 * userRepository.findById(request.authorId) >> Optional.of(author)
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
}

