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

package io.charlescd.moove.application.user

import io.charlescd.moove.application.UserService
import io.charlescd.moove.domain.Page
import io.charlescd.moove.domain.PageRequest
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.service.ManagementUserSecurityService
import spock.lang.Specification

import java.time.LocalDateTime

class UserServiceTest extends Specification {

    private UserService userService

    private UserRepository userRepository = Mock(UserRepository)
    private ManagementUserSecurityService managementUserSecurityService = Mock(ManagementUserSecurityService)

    void setup() {
        this.userService = new UserService(userRepository, managementUserSecurityService)
    }

    def "when save user should not throw"() {
        given:
        def user = getDummyUser("charles@email.com")

        when:
        this.userService.save(user)

        then:
        1 * this.userRepository.save(user) >> user

        notThrown()
    }

    def "when update user should not throw"() {
        given:
        def user = getDummyUser("charles@email.com")

        when:
        this.userService.update(user)

        then:
        1 * this.userRepository.update(user) >> user

        notThrown()
    }

    def "when find a user by id and not exists should throw a NotFoundException"() {
        given:
        def userId = "qwerty-12345-asdf-98760"

        when:
        this.userService.find(userId)

        then:
        1 * this.userRepository.findById(userId) >> Optional.empty()

        def ex = thrown(NotFoundException)
        ex.resourceName == "user"
        ex.id == userId
    }

    def "when find a user by id and exists should return them"() {
        given:
        def userId = "qwerty-12345-asdf-98760"

        when:
        this.userService.find(userId)

        then:
        1 * this.userRepository.findById(userId) >> Optional.of(getDummyUser("charles@email.com"))

        notThrown()
    }

    def "when find all users and not exists should return empty list"() {
        given:
        def pageRequest = new PageRequest()
        def user = getDummyUser("charles@charles.com")
        def emptyPage = new Page([], 0, 20, 0)
        def name = "charles"

        when:
        this.userService.findAll(name, null, pageRequest)

        then:
        1 * this.userRepository.findAll(name, null, pageRequest) >> { arguments ->
            return emptyPage
        }

        notThrown()
    }

    def "when find all users and exists should return them"() {
        given:
        def pageRequest = new PageRequest()
        def user = getDummyUser("charles@charles.com")
        def page = new Page([user], 0, 20, 1)
        def name = "charles"

        when:
        this.userService.findAll(name, null, pageRequest)

        then:
        1 * this.userRepository.findAll(name, null, pageRequest) >> { arguments ->
            return page
        }
    }

    def "when find a user by email and not exists should throw an NotFoundException"() {
        given:
        def email = "charles@email.com"

        when:
        this.userService.findByEmail(email)

        then:
        1 * this.userRepository.findByEmail(email) >> Optional.empty()

        def ex = thrown(NotFoundException)
        ex.resourceName == "user"
    }

    def "when find a user by email and exists should return them"() {
        given:
        def email = "charles@email.com"

        when:
        this.userService.findByEmail(email)

        then:
        1 * this.userRepository.findByEmail(email) >> Optional.of(getDummyUser(email))

        notThrown()
    }

    def "when check if user with email and exists should throw an BusinessException"() {
        given:
        def email = "charles@email.com"
        def user = getDummyUser(email)

        when:
        this.userService.checkIfEmailAlreadyExists(user)

        then:
        1 * this.userRepository.findByEmail(email) >> Optional.of(getDummyUser(email))

        thrown(BusinessException)

    }

    def "when check if a user with email and not exists should not throw"() {
        given:
        def email = "charles@email.com"
        def user = getDummyUser(email)

        when:
        this.userService.checkIfEmailAlreadyExists(user)

        then:
        1 * this.userRepository.findByEmail(email) >> Optional.empty()

        notThrown()
    }

    def "when find by id token not exists should throw a NotFoundException"() {
        given:
        def authorization = "Bearer qwerty-12345-asdf-98760"
        def email = "charles@email.com"

        when:
        this.userService.findByAuthorizationToken(authorization)

        then:
        1 * this.managementUserSecurityService.getUserEmail(authorization) >> email
        1 * this.userRepository.findByEmail(email) >> Optional.empty()

        def ex = thrown(NotFoundException)
        ex.resourceName == "user"
    }

    def "when find a user by token and exists should return them"() {
        given:
        def authorization = "Bearer qwerty-12345-asdf-98760"
        def email = "charles@email.com"

        when:
        this.userService.findByAuthorizationToken(authorization)

        then:
        1 * this.managementUserSecurityService.getUserEmail(authorization) >> email
        1 * this.userRepository.findByEmail(email) >> Optional.of(getDummyUser(email))

        notThrown()
    }

    def "when get email from token should not throw"() {
        given:
        def authorization = "Bearer qwerty-12345-asdf-98760"
        def email = "charles@email.com"

        when:
        this.userService.getEmailFromToken(authorization)

        then:
        1 * this.managementUserSecurityService.getUserEmail(authorization) >> email

        notThrown()
    }

    def "should change user password"() {
        given:
        def userEmail = "charles@email.com"
        def user = getDummyUser(userEmail)
        def oldPassword = "oldPassword"
        def newPassword = "newPassword"

        when:
        this.userService.changePassword(userEmail, oldPassword, newPassword)

        then:
        1 * this.managementUserSecurityService.changePassword(user.email, oldPassword, newPassword)

        notThrown()
    }

    def "should reset user password"() {
        given:
        def userEmail = "charles@email.com"
        def newPassword = "newPassword"

        when:
        this.userService.resetPassword(userEmail, newPassword)

        then:
        1 * this.managementUserSecurityService.resetUserPassword(userEmail, newPassword)

        notThrown()
    }

    def "should create user on keycloack"() {
        given:
        def userEmail = "charles@email.com"
        def userName = "charles"
        def userPassword = "password"

        when:
        this.userService.createUserOnKeycloak(userEmail, userName, userPassword)

        then:
        1 * this.managementUserSecurityService.createUser(userEmail, userName, userPassword)

        notThrown()
    }

    private User getDummyUser(String email) {
        new User("qwerty-12345-asdf-98760", "charles", email, "http://charles.com/dummy_photo.jpg", [], false, LocalDateTime.now())
    }
}
