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

package io.charlescd.moove.legacy.moove.service

import io.charlescd.moove.commons.constants.MooveErrorCodeLegacy
import io.charlescd.moove.commons.exceptions.BusinessExceptionLegacy
import io.charlescd.moove.commons.exceptions.NotFoundExceptionLegacy
import io.charlescd.moove.commons.representation.UserRepresentation
import io.charlescd.moove.legacy.moove.request.user.AddGroupsRequest
import io.charlescd.moove.legacy.moove.request.user.ResetPasswordRequest
import io.charlescd.moove.legacy.moove.request.user.UpdateUserRequest
import io.charlescd.moove.legacy.repository.UserRepository
import io.charlescd.moove.legacy.repository.entity.User
import spock.lang.Specification

import java.time.LocalDateTime

class UserServiceLegacyGroovyUnitTest extends Specification {

    private String decodedEmail = "email"
    private User user = new User(
            "81861b6f-2b6e-44a1-a745-83e298a550c9",
            "John Doe",
            decodedEmail,
            "https://www.photos.com/johndoe",
            false,
            LocalDateTime.now()
    )
    private UserRepresentation representation = new UserRepresentation(
            "81861b6f-2b6e-44a1-a745-83e298a550c9",
            "John Doe",
            decodedEmail,
            "https://www.photos.com/johndoe",
            false,
            LocalDateTime.now()
    )
    private UserRepository repository = Mock(UserRepository)
    private KeycloakService keycloakService = Mock(KeycloakService)
    private UserServiceLegacy service
    private Boolean idmEnabled = true

    def setup() {
        service = new UserServiceLegacy(repository, keycloakService, idmEnabled)
    }

    def "should update user by id"() {
        given:
        def request = new UpdateUserRequest("John Doe", "email", "https://www.photos.com/johndoe")

        when:
        def response = service.update(representation.id, request)

        then:
        1 * repository.findById(representation.id) >> Optional.of(user)
        1 * repository.saveAndFlush(user) >> user
        response.id == representation.id
        response.name == request.name
        response.photoUrl == request.photoUrl
    }

    def "shouldn't update user cause using external idm"() {
        given:
        service = new UserServiceLegacy(repository, keycloakService, false)

        def request = new UpdateUserRequest("John Doe", "email", "https://www.photos.com/johndoe")

        when:
        service.update(representation.id, request)

        then:
        0 * repository.findById(representation.id) >> Optional.of(user)
        0 * repository.saveAndFlush(user) >> user

        def exception = thrown(BusinessExceptionLegacy)
        exception.errorCode == MooveErrorCodeLegacy.EXTERNAL_IDM_FORBIDDEN
    }

    def "should throw exception on update if user id do not exist"() {
        given:
        def request = new UpdateUserRequest("John Doe", "email", "https://www.photos.com/johndoe")

        when:
        service.update("test", request)

        then:
        1 * repository.findById("test") >> Optional.empty()
        def ex = thrown(NotFoundExceptionLegacy)
        ex.resourceName == "user"
        ex.id == "test"
    }

    def "should delete by id"() {
        when:
        def response = service.delete(representation.id)

        then:
        1 * repository.findById(representation.id) >> Optional.of(user)
        1 * keycloakService.deleteUserByEmail(_)
        1 * repository.delete(user)
        response.id == representation.id
        response.name == representation.name
        response.photoUrl == representation.photoUrl
        notThrown()
    }

    def "should throw exception on delete if user id do not exist"() {
        when:
        service.delete("test")

        then:
        1 * repository.findById("test") >> Optional.empty()
        def ex = thrown(NotFoundExceptionLegacy)
        ex.resourceName == "user"
        ex.id == "test"
    }

    def "shouldn't delete user cause using external idm"() {
        given:
        service = new UserServiceLegacy(repository, keycloakService, false)

        when:
        service.delete(representation.id)

        then:
        0 * repository.findById(representation.id) >> Optional.of(user)
        0 * keycloakService.deleteUserByEmail(_)
        0 * repository.delete(user)

        def exception = thrown(BusinessExceptionLegacy)
        exception.errorCode == MooveErrorCodeLegacy.EXTERNAL_IDM_FORBIDDEN
    }

    def "should add groups to an user"() {

        given:
        def userId = "fake-user-id"
        def email = "john.doe@zup.com.br"
        def user = new User(userId, "John Doe", email, "http://fakephoto.com.br/john.jpg", false, LocalDateTime.now())
        def groupIds = new ArrayList()
        groupIds.add("fake-group-id")
        def request = new AddGroupsRequest(groupIds)

        when:
        service.addGroupsToUser(userId, request)

        then:
        1 * repository.findById(userId) >> Optional.of(user)
        1 * keycloakService.addGroupsToUser(email, groupIds)

        notThrown()

    }

    def "should remove an user from a group"() {

        given:
        def userId = "fake-user-id"
        def groupId = "fake-group-id"
        def email = "john.doe@zup.com.br"
        def user = new User(userId, "John Doe", email, "http://fakephoto.com.br/john.jpg", false, LocalDateTime.now())

        when:
        service.removeUserFromGroup(userId, groupId)

        then:

        1 * this.repository.findById(userId) >> Optional.of(user)
        1 * this.keycloakService.removeUserFromGroup(user.email, groupId)

        notThrown()
    }

    def "should thrown an user from a group"() {

        given:
        def userId = "fake-user-id"
        def groupId = "fake-group-id"
        def email = "john.doe@zup.com.br"
        def user = new User(userId, "John Doe", email, "http://fakephoto.com.br/john.jpg", false, LocalDateTime.now())

        when:
        service.removeUserFromGroup(userId, groupId)

        then:

        1 * this.repository.findById(userId) >> Optional.of(user)
        1 * this.keycloakService.removeUserFromGroup(user.email, groupId)

        notThrown()
    }

    def "should reset password to an user"() {

        given:
        def email = "john.doe@zup.com.br"
        def request = new ResetPasswordRequest("newPassword")

        when:
        service.resetPassword(email, request)

        then:
        1 * keycloakService.resetPassword(email, request.newPassword)
        notThrown()

    }

    def "shouldn't reset password to an user cause using external idm"() {

        given:
        service = new UserServiceLegacy(repository, keycloakService, false)

        def email = "john.doe@zup.com.br"
        def request = new ResetPasswordRequest("newPassword")

        when:
        service.resetPassword(email, request)

        then:
        0 * keycloakService.resetPassword(email, request.newPassword)

        def exception = thrown(BusinessExceptionLegacy)
        exception.errorCode == MooveErrorCodeLegacy.EXTERNAL_IDM_FORBIDDEN
    }
}
