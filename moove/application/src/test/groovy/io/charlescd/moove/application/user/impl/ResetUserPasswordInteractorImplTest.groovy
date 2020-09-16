/*
 *
 *  * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *
 */

package io.charlescd.moove.application.user.impl

import io.charlescd.moove.application.UserPasswordGeneratorService
import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.user.ResetUserPasswordInteractor
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.service.KeycloakService
import spock.lang.Specification

import java.time.LocalDateTime

class ResetUserPasswordInteractorImplTest extends Specification {

    private ResetUserPasswordInteractor resetUserPasswordInteractor

    private KeycloakService keycloakService = Mock(KeycloakService)

    private UserRepository userRepository = Mock(UserRepository)

    /**
     * ^                 # start-of-string
     * (?=.*[0-9])       # a digit must occur at least once
     * (?=.*[a-z])       # a lower case letter must occur at least once
     * (?=.*[A-Z])       # an upper case letter must occur at least once
     * (?=.*[@#$%^&+=])  # a special character must occur at least once
     * (?=\S+$)          # no whitespace allowed in the entire string
     * .{8,}             # anything, at least eight places though
     * $                 # end-of-string
     */
    private static final String PASSWORD_CHECK = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$^*()_])(?=\\S+\$).{8,}\$"

    void setup() {
        resetUserPasswordInteractor = new ResetUserPasswordInteractorImpl(new UserPasswordGeneratorService(), keycloakService, new UserService(userRepository))
    }

    def "should generate a valid password"() {
        given:
        def matchValidation = PASSWORD_CHECK
        def userId = UUID.randomUUID()
        def authorization = "authorization"
        def user = new User(userId.toString(), "user name", "user@zup.com.br", "http://image.com.br/photo.png",
                [], false, LocalDateTime.now())
        def root = new User(userId.toString(), "Root", "root@zup.com.br", "http://image.com.br/photo.png",
                [], false, LocalDateTime.now())

        when:
        def response = resetUserPasswordInteractor.execute(authorization, userId)

        then:
        1 * userRepository.findById(userId.toString()) >> Optional.of(user)
        1 * keycloakService.resetPassword(user.getEmail(), _)
        1 * keycloakService.getEmailByAccessToken(authorization) >> root.getEmail()
        1 * userRepository.findByEmail(root.getEmail()) >> Optional.of(root)
        assert response != null
        assert response.newPassword.size() == 10
        assert response.newPassword.matches(matchValidation)
    }

    def "should generate 10 valid passwords"() {
        given:
        def matchValidation = PASSWORD_CHECK
        def numberOfPasswords = 10
        def userId = UUID.randomUUID()
        def authorization = "authorization"
        def user = new User(userId.toString(), "user name", "user@zup.com.br", "http://image.com.br/photo.png",
                [], false, LocalDateTime.now())
        def root = new User(userId.toString(), "Root", "root@zup.com.br", "http://image.com.br/photo.png",
                [], false, LocalDateTime.now())

        when:
        def passwords = []
        for (i in 1..numberOfPasswords) {
            passwords.add(resetUserPasswordInteractor.execute(authorization, userId))
        }

        then:
        numberOfPasswords * userRepository.findById(userId.toString()) >> Optional.of(user)
        numberOfPasswords * keycloakService.resetPassword(user.getEmail(), _)
        numberOfPasswords * keycloakService.getEmailByAccessToken(authorization) >> root.getEmail()
        numberOfPasswords * userRepository.findByEmail(root.getEmail()) >> Optional.of(root)
        passwords.stream().forEach({ response ->
            assert response.newPassword.size() == 10
            assert response.newPassword.matches(matchValidation)
        })
    }

    def "should not reset your own password"() {
        given:
        def matchValidation = PASSWORD_CHECK
        def userId = UUID.randomUUID()
        def authorization = "authorization"
        def user = new User(userId.toString(), "Root", "root@zup.com.br", "http://image.com.br/photo.png",
                [], false, LocalDateTime.now())
        def root = new User(userId.toString(), "Root", "root@zup.com.br", "http://image.com.br/photo.png",
                [], false, LocalDateTime.now())

        when:
        def response = resetUserPasswordInteractor.execute(authorization, userId)

        then:
        1 * userRepository.findById(userId.toString()) >> Optional.of(user)
        1 * keycloakService.getEmailByAccessToken(authorization) >> root.getEmail()
        1 * userRepository.findByEmail(root.getEmail()) >> Optional.of(root)
        def ex = thrown(BusinessException)
        ex.errorCode == MooveErrorCode.CANNOT_RESET_YOUR_OWN_PASSWORD
    }
}
