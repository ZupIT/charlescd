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

package io.charlescd.moove.legacy.moove.controller

import io.charlescd.moove.commons.representation.UserRepresentation
import io.charlescd.moove.legacy.moove.request.user.AddGroupsRequest
import io.charlescd.moove.legacy.moove.request.user.CreateUserRequest
import io.charlescd.moove.legacy.moove.request.user.ResetPasswordRequest
import io.charlescd.moove.legacy.moove.request.user.UpdateUserRequest
import io.charlescd.moove.legacy.moove.service.KeycloakService
import io.charlescd.moove.legacy.moove.service.UserServiceLegacy
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import spock.lang.Specification

import java.time.LocalDateTime

class UserControllerUnitTest extends Specification {

    UserRepresentation representation = new UserRepresentation(
            "81861b6f-2b6e-44a1-a745-83e298a550c9",
            "John Doe",
            "email",
            "https://www.photos.com/johndoe",
            false,
            LocalDateTime.now()
    )
    Pageable pageable = PageRequest.of(0, 5)
    UserServiceLegacy service = Mock(UserServiceLegacy)
    KeycloakService keycloakService = Mock(KeycloakService)
    UserController controller

    def "setup"() {
        controller = new UserController(service, keycloakService)
    }

    def "should create user"() {
        given:
        def request = new CreateUserRequest("John Doe", "123fakepassword", "email", "https://www.photos.com/johndoe", false)

        when:
        def response = controller.create(request)

        then:
        1 * service.create(request) >> representation
        response.id == "81861b6f-2b6e-44a1-a745-83e298a550c9"
        response.name == request.name
        response.photoUrl == request.photoUrl
    }

    def "should update user"() {
        given:
        def request = new UpdateUserRequest("John Doe", "email", "https://www.photos.com/johndoe")

        when:
        controller.update(representation.id, request)

        then:
        1 * service.update(representation.id, request)
        notThrown()
    }

    def "should delete user"() {
        when:
        controller.delete(representation.id)

        then:
        1 * service.delete(representation.id)
        notThrown()
    }

    def "should add group to user"() {

        given:
        def userId = "fake-user-id"
        def groupIds = new ArrayList()
        groupIds.add("fake-group-id")
        def request = new AddGroupsRequest(groupIds)

        when:
        controller.addGroups(userId, request)

        then:
        1 * service.addGroupsToUser(userId, request)
        notThrown()
    }

    def "should reset password to an user"() {

        given:
        def email = "john.doe@zup.com.br"
        def request = new ResetPasswordRequest("newPassword")

        when:
        controller.resetPassword(email, request)

        then:
        1 * service.resetPassword(email, request)
        notThrown()

    }

    def "should remove an user from a group"() {

        given:
        def userId = "fake-user-id"
        def groupId = "fake-group-id"

        when:
        controller.removeUserFromGroup(userId, groupId)

        then:

        1 * service.removeUserFromGroup(userId, groupId)

        notThrown()

    }
}
