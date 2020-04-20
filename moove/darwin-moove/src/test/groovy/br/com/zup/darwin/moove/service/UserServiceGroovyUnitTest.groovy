/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. 
 */

package br.com.zup.darwin.moove.service

import br.com.zup.darwin.commons.representation.UserRepresentation
import br.com.zup.darwin.entity.User
import br.com.zup.darwin.moove.request.user.AddGroupsRequest
import br.com.zup.darwin.moove.request.user.CreateUserRequest
import br.com.zup.darwin.moove.request.user.ResetPasswordRequest
import br.com.zup.darwin.moove.request.user.UpdateUserRequest
import br.com.zup.darwin.repository.UserRepository
import br.com.zup.exception.handler.exception.NotFoundException
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import spock.lang.Specification

import java.time.LocalDateTime

class UserServiceGroovyUnitTest extends Specification {

    private String decodedEmail = "email"
    private String encodedEmail = "ZW1haWw="
    private User user = new User(
            "81861b6f-2b6e-44a1-a745-83e298a550c9",
            "John Doe",
            decodedEmail,
            "https://www.photos.com/johndoe",
            [],
            LocalDateTime.now()
    )
    private UserRepresentation representation = new UserRepresentation(
            "81861b6f-2b6e-44a1-a745-83e298a550c9",
            "John Doe",
            decodedEmail,
            "https://www.photos.com/johndoe",
            [],
            LocalDateTime.now()
    )
    private Pageable pageable = PageRequest.of(0, 5)
    private UserRepository repository = Mock(UserRepository)
    private KeycloakService keycloakService = Mock(KeycloakService)
    private UserService service

    def setup() {
        service = new UserService(repository, keycloakService)
    }

    def "should find all users"() {
        when:
        def response = service.findAll(pageable)

        then:
        1 * repository.findAll(pageable) >> new PageImpl<>([user], pageable, 1)
        response.size() == 1
    }

    def "should find user by email"() {
        when:
        def response = service.findByEmail(encodedEmail)

        then:
        1 * repository.findByEmail(decodedEmail) >> Optional.of(user)
        representation.id == response.id
        representation.name == response.name
        representation.email == response.email
        representation.photoUrl == response.photoUrl
    }

    def "should not find user by email"() {
        when:
        service.findByEmail("YmF0YXRpbmhh")

        then:
        1 * repository.findByEmail("batatinha") >> Optional.empty()
        def ex = thrown(NotFoundException)
        ex.resource.resource == "user"
        ex.resource.value == "YmF0YXRpbmhh"
    }

    def "should create user"() {
        given:
        def request = new CreateUserRequest("John Doe", "123fakepassword", "email", "https://www.photos.com/johndoe")

        when:
        def response = service.create(request)

        then:
        1 * repository.saveAndFlush(_) >> user
        1 * keycloakService.createUser(_, _, _)
        response.id == representation.id
        response.name == request.name
        response.photoUrl == request.photoUrl
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
        def ex = thrown(NotFoundException)
        ex.resource.resource == "user"
        ex.resource.value == "batatinha"
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
        def ex = thrown(NotFoundException)
        ex.resource.resource == "user"
        ex.resource.value == "batatinha"
    }

    def "should add groups to an user"() {

        given:
        def userId = "fake-user-id"
        def email = "john.doe@zup.com.br"
        def user = new User(userId, "John Doe", email, "http://fakephoto.com.br/john.jpg", [], LocalDateTime.now())
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
        def user = new User(userId, "John Doe", email, "http://fakephoto.com.br/john.jpg", [], LocalDateTime.now())

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
        def user = new User(userId, "John Doe", email, "http://fakephoto.com.br/john.jpg", [], LocalDateTime.now())

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

    def "when finding user by email, if passing an email with uppercase should find it"() {

        given:
        def emailEncoded = "am9zZS5EYS5TaWx2YUB6dXAuY29tLmJy"
        def emailDecoded = "jose.Da.Silva@zup.com.br"

        when:
        service.findByEmail(emailEncoded)

        then:
        1 * repository.findByEmail(emailDecoded.toLowerCase()) >> Optional.of(user)
        notThrown()
    }

}
