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

import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.workspace.FindAllWorkspaceInteractor
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.repository.WorkspaceRepository
import spock.lang.Specification

import java.time.LocalDateTime

class FindAllWorkspaceInteractorImplTest extends Specification {

    private FindAllWorkspaceInteractor findAllWorkspaceInteractor

    private UserRepository userRepository = Mock(UserRepository)
    private WorkspaceRepository workspaceRepository = Mock(WorkspaceRepository)

    def setup() {
        this.findAllWorkspaceInteractor = new FindAllWorkspaceInteractorImpl(new WorkspaceService(workspaceRepository, userRepository))
    }

    def "when there is no workspaces should return an empty page"() {
        given:
        def pageRequest = new PageRequest()
        def emptyPage = new Page([], 0, 20, 0)

        when:
        def response = this.findAllWorkspaceInteractor.execute(pageRequest, null)

        then:
        1 * this.workspaceRepository.find(_, null) >> { arguments ->
            def argPageRequest = arguments[0]

            assert argPageRequest instanceof PageRequest

            return emptyPage
        }

        assert response != null
        assert response.page == 0
        assert response.size == 0
        assert response.content.size() == 0
        assert response.totalPages == 1
        assert response.isLast
    }

    def "when there are workspaces, should list them"() {
        given:
        def pageRequest = new PageRequest()
        def author = new User("author", "charles", "charles@zup.com.br", "http://charles.com/dummy_photo.jpg", [], false, LocalDateTime.now())
        def workspace = new Workspace("workspace-id", "workspace-name", author, LocalDateTime.now(), [], WorkspaceStatusEnum.INCOMPLETE, "registry-configuration-id",
                "circle-matcher-url", "git-configuration-id", "cd-configuration-id", null)
        def page = new Page([workspace], 0, 20, 1)

        when:
        def response = this.findAllWorkspaceInteractor.execute(pageRequest, null)

        then:
        1 * this.workspaceRepository.find(_, null) >> { arguments ->
            def argPageRequest = arguments[0]

            assert argPageRequest instanceof PageRequest

            return page
        }

        assert response != null
        assert response.page == 0
        assert response.size == 1
        assert response.content.size() == 1
        assert response.content[0].id == workspace.id
        assert response.content[0].name == workspace.name
        assert response.content[0].status == workspace.status.toString()
        assert response.content[0].circleMatcherUrl == workspace.circleMatcherUrl
        assert response.content[0].registryConfiguration == null
        assert response.content[0].gitConfiguration == null
        assert response.content[0].cdConfiguration == null
        assert response.content[0].createdAt == workspace.createdAt
        assert response.content[0].authorId == workspace.author.id
        assert response.totalPages == 1
        assert response.isLast
    }

}
