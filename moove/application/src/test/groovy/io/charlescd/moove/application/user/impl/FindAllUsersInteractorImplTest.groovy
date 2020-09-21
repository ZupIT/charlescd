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

package io.charlescd.moove.application.user.impl

import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.user.FindAllUsersInteractor
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.repository.UserRepository
import spock.lang.Specification

import java.time.LocalDateTime

class FindAllUsersInteractorImplTest extends Specification {

    private FindAllUsersInteractor findAllUsersInteractor

    private UserRepository userRepository = Mock(UserRepository)

    void setup() {
        this.findAllUsersInteractor = new FindAllUsersInteractorImpl(new UserService(userRepository))
    }

    def "when there is no user should return an empty page"() {
        given:
        def pageRequest = new PageRequest()
        def emptyPage = new Page([], 0, 20, 0)

        when:
        def response = this.findAllUsersInteractor.execute(null, null, pageRequest)

        then:
        1 * this.userRepository.findAll(_, _, _) >> { arguments ->
            def argPageRequest = arguments[2]

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

    def "when there are users, should list them"() {
        given:
        def pageRequest = new PageRequest()
        def author = new User("author-id", "charles-author", "author@zup.com.br", "http://charles.com/dummy_photo.jpg", [], false, LocalDateTime.now())
        def permission = new Permission("permission-id", "permission-name", LocalDateTime.now())
        def workspacePermission = new WorkspacePermissions("workspace-id", "workspace-name", [permission], author, LocalDateTime.now(), WorkspaceStatusEnum.COMPLETE)
        def user = new User("user-id", "charles-user", "user@zup.com.br", "http://charles.com/dummy_photo.jpg", [workspacePermission], false, LocalDateTime.now())
        def page = new Page([user], 0, 20, 1)

        when:
        def response = this.findAllUsersInteractor.execute(null, null, pageRequest)

        then:
        1 * this.userRepository.findAll(_, _, _) >> { arguments ->
            def argPageRequest = arguments[2]

            assert argPageRequest instanceof PageRequest

            return page
        }

        assert response != null
        assert response.page == 0
        assert response.size == 1
        assert response.content.size() == 1
        assert response.content[0].id == user.id
        assert response.content[0].name == user.name
        assert response.content[0].email == user.email
        assert response.content[0].photoUrl == user.photoUrl
        assert response.content[0].createdAt == user.createdAt
        assert response.content[0].workspaces.size() == user.workspaces.size()
        assert response.content[0].workspaces[0].id == workspacePermission.id
        assert response.content[0].workspaces[0].name == workspacePermission.name
        assert response.content[0].workspaces[0].permissions.size() == workspacePermission.permissions.size()
        assert response.content[0].workspaces[0].permissions[0] == workspacePermission.permissions[0].name

        assert response.totalPages == 1
        assert response.isLast
    }
}
