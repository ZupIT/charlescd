/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. 
 */

package br.com.zup.darwin.moove.controller

import br.com.zup.darwin.commons.representation.UserRepresentation
import br.com.zup.darwin.moove.request.user.AddGroupsRequest
import br.com.zup.darwin.moove.request.user.CreateUserRequest
import br.com.zup.darwin.moove.request.user.ResetPasswordRequest
import br.com.zup.darwin.moove.request.user.UpdateUserRequest
import br.com.zup.darwin.moove.service.KeycloakService
import br.com.zup.darwin.moove.service.UserService
import br.com.zup.exception.handler.exception.NotFoundException
import br.com.zup.exception.handler.to.ResourceValue
import org.springframework.data.domain.PageImpl
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
            [],
            LocalDateTime.now()
    )
    Pageable pageable = PageRequest.of(0, 5)
    UserService service = Mock(UserService)
    KeycloakService keycloakService = Mock(KeycloakService)
    UserController controller

    def "setup"() {
        controller = new UserController(service, keycloakService)
    }

    def "should find all users"() {
        when:
        def response = controller.findAll(pageable)

        then:
        1 * service.findAll(pageable) >> new PageImpl<>([representation], pageable, 1)
        response.content.size() == 1
        response.last
        response.page == 0
        response.totalPages == 1
    }

    def "should find user by email"() {
        when:
        def response = controller.findByEmail(representation.email)

        then:
        1 * service.findByEmail(representation.email) >> representation
        response.id == representation.id
        response.email == representation.email
        response.name == representation.name
        response.photoUrl == representation.photoUrl
    }

    def "should return exception if service not found"() {
        when:
        controller.findByEmail("batata")

        then:
        1 * service.findByEmail("batata") >> { throw new NotFoundException(new ResourceValue("user", "batata")) }
        def e = thrown(NotFoundException)
        e.resource.resource == "user"
        e.resource.value == "batata"
    }

    def "should create user"() {
        given:
        def request = new CreateUserRequest("John Doe", "123fakepassword", "email", "https://www.photos.com/johndoe")

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
