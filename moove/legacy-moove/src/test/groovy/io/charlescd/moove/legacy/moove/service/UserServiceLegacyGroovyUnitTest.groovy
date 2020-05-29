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

import io.charlescd.moove.commons.exceptions.NotFoundExceptionLegacy
import io.charlescd.moove.commons.representation.UserRepresentation
import io.charlescd.moove.legacy.moove.request.user.AddGroupsRequest
import io.charlescd.moove.legacy.moove.request.user.CreateUserRequest
import io.charlescd.moove.legacy.moove.request.user.ResetPasswordRequest
import io.charlescd.moove.legacy.moove.request.user.UpdateUserRequest
import io.charlescd.moove.legacy.repository.UserRepository
import io.charlescd.moove.legacy.repository.entity.User
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
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
    private Pageable pageable = PageRequest.of(0, 5)
    private UserRepository repository = Mock(UserRepository)
    private KeycloakService keycloakService = Mock(KeycloakService)
    private UserServiceLegacy service

    def setup() {
        service = new UserServiceLegacy(repository, keycloakService)
    }

    def "should create user"() {
        given:
        def request = new CreateUserRequest("John Doe", "123fakepassword", "email", "https://www.photos.com/johndoe", false)

        when:
        def response = service.create(request)

        then:
        1 * repository.saveAndFlush(_) >> user
        1 * keycloakService.createUser(request.email, request.name, request.password, false)
        response.id == representation.id
        response.name == request.name
        response.photoUrl == request.photoUrl
        notThrown()
    }

    def "should create user with email trim and lowercased"() {
        given:
        def request = new CreateUserRequest("John Doe", "123fakepassword", "   EmAiL   ", "https://www.photos.com/johndoe", false)

        when:
        def response = service.create(request)

        then:
        1 * repository.saveAndFlush(_) >> { arguments ->
            def actualUser = arguments[0]

            assert actualUser instanceof User

            assert request.email != actualUser.email
            assert actualUser.email == request.email.toLowerCase().trim()

            return user
        }
        1 * keycloakService.createUser(request.email.toLowerCase().trim(), request.name, request.password, false)
        response.id == representation.id
        response.name == request.name
        response.photoUrl == request.photoUrl
        response.email == request.email.toLowerCase().trim()
        notThrown()
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

    def "should throw exception on update if user id do not exist"() {
        given:
        def request = new UpdateUserRequest("John Doe", "email", "https://www.photos.com/johndoe")

        when:
        service.update("batatinha", request)

        then:
        1 * repository.findById("batatinha") >> Optional.empty()
        def ex = thrown(NotFoundExceptionLegacy)
        ex.resourceName == "user"
        ex.id == "batatinha"
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
        service.delete("batatinha")

        then:
        1 * repository.findById("batatinha") >> Optional.empty()
        def ex = thrown(NotFoundExceptionLegacy)
        ex.resourceName == "user"
        ex.id == "batatinha"
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

}
