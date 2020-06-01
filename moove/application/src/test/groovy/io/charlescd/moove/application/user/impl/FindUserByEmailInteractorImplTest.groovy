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
import io.charlescd.moove.application.user.FindUserByEmailInteractor
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.Workspace
import io.charlescd.moove.domain.WorkspaceStatusEnum
import io.charlescd.moove.domain.repository.UserRepository
import spock.lang.Specification

import java.time.LocalDateTime

class FindUserByEmailInteractorImplTest extends Specification {

    private FindUserByEmailInteractor findUserByEmailInteractor

    private UserRepository userRepository = Mock(UserRepository)

    void setup() {
        findUserByEmailInteractor = new FindUserByEmailInteractorImpl(new UserService(userRepository))
    }

    def "should find an user by its email"() {
        given:
        def base64Email = "dXNlckB6dXAuY29tLmJy"

        def author = new User("f52f94b8-6775-470f-bac8-125ebfd6b636", "zup", "zup@zup.com.br", "http://image.com.br/photo.png",
                [], false, LocalDateTime.now())

        def workspace = new Workspace("90e0c89e-c9b4-45f8-9467-f2495c435fc6", "CharleCD", author, LocalDateTime.now(), [], WorkspaceStatusEnum.COMPLETE,
                null, null, null, null, null)

        def user = new User("cfb1a3a4-d3af-46c6-b6c3-33f30f68b28b", "user name", "user@zup.com.br", "http://image.com.br/photo.png",
                [workspace], false, LocalDateTime.now())

        when:
        def response = findUserByEmailInteractor.execute(base64Email)

        then:
        1 * userRepository.findByEmail("user@zup.com.br") >> Optional.of(user)

        assert response != null
        assert response.id == user.id
        assert response.name == user.name
        assert response.createdAt == user.createdAt
        assert response.photoUrl == user.photoUrl
        assert response.workspaces.size() == 1
        assert response.workspaces[0].id == workspace.id
        assert response.workspaces[0].name == workspace.name
    }

    def "should return an user with an empty workspace when no workspaces where found"() {
        given:
        def base64Email = "dXNlckB6dXAuY29tLmJy"

        def user = new User("cfb1a3a4-d3af-46c6-b6c3-33f30f68b28b", "user name", "user@zup.com.br", "http://image.com.br/photo.png",
                [], false, LocalDateTime.now())

        when:
        def response = findUserByEmailInteractor.execute(base64Email)

        then:
        1 * userRepository.findByEmail("user@zup.com.br") >> Optional.of(user)

        assert response != null
        assert response.id == user.id
        assert response.name == user.name
        assert response.createdAt == user.createdAt
        assert response.photoUrl == user.photoUrl
        assert response.workspaces.size() == 0
    }
}
