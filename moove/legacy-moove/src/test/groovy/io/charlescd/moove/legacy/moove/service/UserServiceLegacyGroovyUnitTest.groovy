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
import io.charlescd.moove.legacy.moove.request.user.ResetPasswordRequest
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

    private User root = new User(
            "82861b6f-2b6e-44a1-a745-83e298a550c2",
            "John Doe Root",
            decodedEmail,
            "https://www.photos.com/johndoe",
            true,
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
    private KeycloakServiceLegacy keycloakService = Mock(KeycloakServiceLegacy)
    private UserServiceLegacy service
    private Boolean idmEnabled = true

    def setup() {
        service = new UserServiceLegacy(repository, keycloakService, idmEnabled)
    }

    def "should delete by id"() {
        when:
        def response = service.delete("81861b6f-2b6e-44a1-a745-83e298a550c9", authorization)

        then:
        1 * keycloakService.getEmailByAuthorizationToken(authorization) >> "email@email.com"
        1 * repository.findByEmail("email@email.com") >> Optional.of(root)
        1 * repository.findById("81861b6f-2b6e-44a1-a745-83e298a550c9") >> Optional.of(user)
        1 * keycloakService.deleteUserById(_)
        1 * repository.delete(user)
        response.id == representation.id
        response.name == representation.name
        response.photoUrl == representation.photoUrl
        notThrown()
    }

    def "should delete by user token when not root"() {
        when:
        def response = service.delete("1123", authorization)

        then:
        1 * keycloakService.getEmailByAuthorizationToken(authorization) >> "email@email.com"
        1 * repository.findByEmail("email@email.com") >> Optional.of(user)
        1 * repository.findById(user.id) >> Optional.of(user)
        0 * repository.findById("1123") >> Optional.of(user)
        1 * keycloakService.deleteUserById(_)
        1 * repository.delete(user)
        response.id == representation.id
        response.name == representation.name
        response.photoUrl == representation.photoUrl
        notThrown()
    }

    def "should throw exception on delete if user id do not exist"() {
        when:
        service.delete("test", authorization)

        then:
        1 * keycloakService.getEmailByAuthorizationToken(   authorization) >> "test"
        1 * repository.findByEmail("test") >> Optional.empty()
        def ex = thrown(NotFoundExceptionLegacy)
        ex.resourceName == "user"
        ex.id == "test"
    }

    def "shouldn't delete user cause using external idm"() {
        given:
        service = new UserServiceLegacy(repository, keycloakService, false)

        when:
        def response = service.delete(representation.id, authorization)

        then:
        0 * keycloakService.getEmailByAuthorizationToken(authorization) >> "email@email.com"
        0 * repository.findByEmail("email@email.com") >> Optional.of(user)
        0 * repository.findById(representation.id) >> Optional.of(user)
        0 * keycloakService.deleteUserById(_)
        0 * repository.delete(user)

        def exception = thrown(BusinessExceptionLegacy)
        exception.errorCode == MooveErrorCodeLegacy.EXTERNAL_IDM_FORBIDDEN
    }

    def "should get user by id"() {

        when:
        def response = service.findUser(representation.id)

        then:
        1 * repository.findById(representation.id) >> Optional.of(user)
        response.id == representation.id
    }

    def "should throw NotFoundException when get invalid user by id"() {

        when:
        service.findUser(representation.id)

        then:
        1 * repository.findById(representation.id) >> Optional.empty()
        thrown(NotFoundExceptionLegacy)
    }

    def "should get users "() {

        given:
        def ids = ['id']

        when:
        service.findUsers(ids)

        then:
        1 * repository.findAllById(ids) >> [user]
        notThrown()
    }

    def "should throw NotFoundException when get invalid users"() {

        given:
        def ids = ['id']

        when:
        service.findUsers(ids)

        then:
        1 * repository.findAllById(ids) >> []
        thrown(NotFoundExceptionLegacy)
    }

    def "should get user by auth token"() {

        when:
        def response = service.findByAuthorizationToken(authorization)

        then:
        1 * keycloakService.getEmailByAuthorizationToken(authorization) >> user.email
        1 * repository.findByEmail(user.email) >> Optional.of(user)
        response.id == representation.id
    }

    def "should throw NotFoundException when get invalid user by auth token"() {

        when:
        service.findByAuthorizationToken(authorization)

        then:
        1 * keycloakService.getEmailByAuthorizationToken(authorization) >> user.email
        1 * repository.findByEmail(user.email) >> Optional.empty()
        thrown(NotFoundExceptionLegacy)
    }

    private static String getAuthorization() {
        return  "Bearer eydGF0ZSI6ImE4OTZmOGFhLTIwZDUtNDI5Ny04YzM2LTdhZWJmZ_qq3";
    }
}
