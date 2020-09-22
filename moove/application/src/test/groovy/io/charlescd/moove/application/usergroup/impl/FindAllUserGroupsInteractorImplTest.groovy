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

package io.charlescd.moove.application.usergroup.impl

import io.charlescd.moove.application.UserGroupService
import io.charlescd.moove.application.usergroup.FindAllUserGroupsInteractor
import io.charlescd.moove.domain.Page
import io.charlescd.moove.domain.PageRequest
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.UserGroup
import io.charlescd.moove.domain.repository.UserGroupRepository
import spock.lang.Specification

import java.time.LocalDateTime

class FindAllUserGroupsInteractorImplTest extends Specification {

    private FindAllUserGroupsInteractor findAllUserGroupsInteractor

    private UserGroupRepository userGroupRepository = Mock(UserGroupRepository)

    void setup() {
        this.findAllUserGroupsInteractor = new FindAllUserGroupsInteractorImpl(new UserGroupService(userGroupRepository))
    }

    def "when there is no user group should return an empty page"() {
        given:
        def name = null
        def pageRequest = new PageRequest()
        def emptyPage = new Page([], 0, 20, 0)

        when:
        def response = this.findAllUserGroupsInteractor.execute(name, pageRequest)

        then:
        1 * this.userGroupRepository.find(_, _) >> { arguments ->
            def argPageRequest = arguments[1]

            assert arguments[0] == name
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

    def "when there are user groups, should list them"() {
        given:
        def name = "group-name"
        def pageRequest = new PageRequest()
        def authorId = "0a859e6c-3cdf-4b34-84d0-f9038576ac58"
        def author = new User(authorId, "charles", "charles@zup.com.br", "http://charles.com/dummy_photo.jpg", [], false, LocalDateTime.now())
        def userGroupId = "user-group-id"
        def userGroup = new UserGroup(userGroupId, "group-name", author, LocalDateTime.now(), [])
        def page = new Page([userGroup], 0, 20, 1)

        when:
        def response = this.findAllUserGroupsInteractor.execute(name, pageRequest)

        then:
        1 * this.userGroupRepository.find(_, _) >> { arguments ->
            def argPageRequest = arguments[1]

            assert arguments[0] == name
            assert argPageRequest instanceof PageRequest

            return page
        }

        assert response != null
        assert response.page == 0
        assert response.size == 1
        assert response.content.size() == 1
        assert response.content[0].id == userGroup.id
        assert response.content[0].name == userGroup.name
        assert response.content[0].createdAt == userGroup.createdAt
        assert response.content[0].author.id == userGroup.author.id
        assert response.content[0].users.size() == userGroup.users.size()
        assert response.totalPages == 1
        assert response.isLast
    }

}
