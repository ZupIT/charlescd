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

import io.charlescd.moove.application.TestUtils
import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.user.CreateUserInteractor
import io.charlescd.moove.application.user.request.CreateUserRequest
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.exceptions.ForbiddenException
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.service.KeycloakService
import io.charlescd.moove.domain.service.ManagementUserSecurityService
import io.charlescd.moove.domain.service.KeycloakService
import io.charlescd.moove.domain.service.ManagementUserSecurityService

import java.time.LocalDateTime
import spock.lang.Specification

class CreateUserInteractorImplTest extends Specification {

    private CreateUserInteractor createUserInteractor
    private UserRepository userRepository = Mock(UserRepository)
    private ManagementUserSecurityService managementUserSecurityService = Mock(ManagementUserSecurityService)

    def setup() {
        createUserInteractor = new CreateUserInteractorImpl(new UserService(userRepository, managementUserSecurityService), true)
    }

    def "when trying to create user should do it successfully"() {
        given:
        def authorizedUser = TestUtils.userRoot
        def newUser = TestUtils.user
        def createUserRequest = new CreateUserRequest(newUser.name, "123fakepassword", newUser.email, newUser.photoUrl, false)
        def authorization = TestUtils.authorization

        when:
        def userResponse = createUserInteractor.execute(createUserRequest, authorization)

        then:
        1 * managementUserSecurityService.getUserEmail(authorization) >> authorizedUser.email.toLowerCase().trim()
        1 * userRepository.findByEmail(authorizedUser.email) >> Optional.of(authorizedUser)
        1 * userRepository.findByEmail(createUserRequest.email) >> Optional.empty()
        1 * userRepository.save(_) >> _
        1 * managementUserSecurityService.createUser(createUserRequest.email, createUserRequest.name, createUserRequest.password)

        userResponse.name == createUserRequest.name
        userResponse.photoUrl == createUserRequest.photoUrl
        notThrown()
    }

    def "when trying to create user should fail on keycloak"() {
        given:
        def authorizedUser = TestUtils.userRoot
        def newUser = TestUtils.user
        def createUserRequest = new CreateUserRequest(newUser.name, "123fakepassword", newUser.email, newUser.photoUrl, false)
        def authorization = TestUtils.authorization

        when:
        createUserInteractor.execute(createUserRequest, authorization)

        then:
        1 * managementUserSecurityService.getUserEmail(authorization) >> authorizedUser.email.toLowerCase().trim()
        1 * userRepository.findByEmail(authorizedUser.email) >> Optional.of(authorizedUser)
        1 * userRepository.findByEmail(createUserRequest.email) >> Optional.empty()
        1 * userRepository.save(_) >> _
        1 * managementUserSecurityService.createUser(createUserRequest.email, createUserRequest.name, createUserRequest.password) >> { throw new RuntimeException("Could not create user on keycloak.") }

        def exception = thrown(BusinessException)
        exception.errorCode == MooveErrorCode.IDM_UNEXPECTED_ERROR
    }

    def "when trying to create a user should trim and lowercase the email"() {
        given:
        def userEmail = TestUtils.emailRoot
        def authorizedUser = TestUtils.userRoot
        def newUser = TestUtils.user
        def createUserRequest = new CreateUserRequest(newUser.name, "123fakepassword", newUser.email, newUser.photoUrl, false)
        def authorization = TestUtils.authorization

        when:
        def userResponse = createUserInteractor.execute(createUserRequest, authorization)

        then:
        1 * userRepository.findByEmail(createUserRequest.email.toLowerCase().trim()) >> Optional.empty()
        1 * userRepository.findByEmail(userEmail) >> Optional.of(authorizedUser)
        1 * userRepository.save(_) >> _
        1 * managementUserSecurityService.createUser(createUserRequest.email.toLowerCase().trim(), createUserRequest.name, createUserRequest.password)
        1 * managementUserSecurityService.getUserEmail(authorization) >> userEmail.toLowerCase().trim()

        userResponse.name == createUserRequest.name
        userResponse.photoUrl == createUserRequest.photoUrl
        userResponse.email == createUserRequest.email.toLowerCase().trim()
        notThrown()
    }

    def "when trying to create user, if email already exists should throw exception"(){
        given:
        def userEmail = TestUtils.emailRoot
        def authorizedUser = TestUtils.userRoot
        def createUserRequest = new CreateUserRequest("John Doe", "123fakepassword", "newuser@teste.com", "https://www.photos.com/johndoe", false)
        def user = createUserRequest.toUser()
        def authorization = TestUtils.authorization

        when:
        createUserInteractor.execute(createUserRequest, authorization)

        then:
        1 * userRepository.findByEmail(user.email) >> Optional.of(user)
        1 * userRepository.findByEmail(userEmail) >> Optional.of(authorizedUser)
        0 * userRepository.save(_) >> user
        0 * managementUserSecurityService.createUser(createUserRequest.email, createUserRequest.name, createUserRequest.password)
        1 * managementUserSecurityService.getUserEmail(authorization) >> userEmail.toLowerCase().trim()

        def exception = thrown(BusinessException)
        exception.errorCode == MooveErrorCode.CREATE_USER_ERROR_EMAIL_ALREADY_EXISTS
    }

    def "when trying to create user, if not its root and its not own user throw exception"(){
        given:
        def userEmail =  TestUtils.email
        def authorizedUser = TestUtils.user
        def createUserRequest = new CreateUserRequest("John Doe", "123fakepassword", "newuser@teste.com", "https://www.photos.com/johndoe", false)
        def user = createUserRequest.toUser()
        def authorization = "Bearer "

        when:
        createUserInteractor.execute(createUserRequest, authorization)

        then:
        0 * userRepository.findByEmail(user.email) >> Optional.empty()
        1 * userRepository.findByEmail(userEmail) >> Optional.of(authorizedUser)
        1 * managementUserSecurityService.getUserEmail(authorization) >> userEmail.toLowerCase().trim()
        0 * userRepository.save(_) >> user
        0 * managementUserSecurityService.createUser(createUserRequest.email, createUserRequest.name, createUserRequest.password)

        def exception = thrown(ForbiddenException)
        "Forbidden!" == exception.getMessage()
    }

    def "when trying to create own user, if not its root and its not own user throw exception"(){
        given:
        def userEmail =  TestUtils.email
        def createUserRequest = new CreateUserRequest("John Doe", "123fakepassword", "newuser@teste.com", "https://www.photos.com/johndoe", false)
        def user = createUserRequest.toUser()
        def authorization = "Bearer "

        when:
        createUserInteractor.execute(createUserRequest, authorization)

        then:
        0 * userRepository.findByEmail(user.email) >> Optional.empty()
        1 * userRepository.findByEmail(userEmail) >> Optional.empty()
        1 * managementUserSecurityService.getUserEmail(authorization) >> userEmail.toLowerCase().trim()
        0 * userRepository.save(_) >> user
        0 * managementUserSecurityService.createUser(createUserRequest.email, createUserRequest.name, createUserRequest.password)

        def exception = thrown(ForbiddenException)
        "Forbidden!" == exception.getMessage()
    }

    def "when trying to create user, if its not root but its own user do it successfully"(){
        given:
        def userEmail = TestUtils.email
        def createUserRequest = new CreateUserRequest("John Doe", "123fakepassword", userEmail, "https://www.photos.com/johndoe", false)
        def user = createUserRequest.toUser()
        def authorization = TestUtils.authorization

        when:
        createUserInteractor.execute(createUserRequest, authorization)

        then:
        1 * userRepository.findByEmail(userEmail) >> Optional.empty()
        1 * userRepository.findByEmail(user.email) >> Optional.empty()
        1 * managementUserSecurityService.getUserEmail(authorization) >> userEmail.toLowerCase().trim()
        1 * userRepository.save(_) >> user
        1 * managementUserSecurityService.createUser(createUserRequest.email, createUserRequest.name, createUserRequest.password)
    }

    def "when trying to create user, if its root but its not own user do it successfully"(){
        given:
        def userEmail = TestUtils.emailRoot
        def authorizedUser = TestUtils.userRoot
        def createUserRequest = new CreateUserRequest("John Doe", "123fakepassword", "teste@teste.com", "https://www.photos.com/johndoe", true)
        def user = createUserRequest.toUser()
        def authorization = TestUtils.authorization

        when:
        createUserInteractor.execute(createUserRequest, authorization)

        then:
        1 * userRepository.findByEmail(user.email) >> Optional.empty()
        1 * userRepository.findByEmail(userEmail) >> Optional.of(authorizedUser)
        1 * managementUserSecurityService.getUserEmail(authorization) >> userEmail.toLowerCase().trim()
        1 * userRepository.save(_) >> user
        1 * managementUserSecurityService.createUser(createUserRequest.email, createUserRequest.name, createUserRequest.password)
    }

    def "when using external idm should not create o keycloak"(){
        given:
        def userEmail = "manager@test.com.br"
        def authorizedUser = TestUtils.userRoot
        def createUserRequest = new CreateUserRequest("John Doe", "123fakepassword", "newuser@teste.com", "https://www.photos.com/johndoe", false)
        def authorization = "Bearer "
        def user = createUserRequest.toUser()

        createUserInteractor = new CreateUserInteractorImpl(
                new UserService(userRepository, managementUserSecurityService),
                false)

        when:
        createUserInteractor.execute(createUserRequest, authorization)

        then:
        1 * userRepository.findByEmail(user.email) >> Optional.empty()
        1 * userRepository.findByEmail(userEmail) >> Optional.of(authorizedUser)
        1 * managementUserSecurityService.getUserEmail(authorization) >> userEmail.toLowerCase().trim()
        1 * userRepository.save(_) >> user
        0 * managementUserSecurityService.createUser(createUserRequest.email, createUserRequest.name, createUserRequest.password)
    }
}
