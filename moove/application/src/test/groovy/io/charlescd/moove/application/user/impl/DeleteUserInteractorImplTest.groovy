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

import io.charlescd.moove.application.TestUtils
import io.charlescd.moove.application.UserPasswordGeneratorService
import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.user.DeleteUserInteractor
import io.charlescd.moove.application.user.ResetUserPasswordInteractor
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.service.ManagementUserSecurityService
import kotlin.Unit
import spock.lang.Specification

import java.time.LocalDateTime

class DeleteUserInteractorImplTest extends Specification {

    private DeleteUserInteractor deleteUserInteractor

    private UserRepository userRepository = Mock(UserRepository)

    private ManagementUserSecurityService managementUserSecurityService = Mock(ManagementUserSecurityService)

    void setup() {
        deleteUserInteractor = new DeleteUserInteractorImpl(new UserService(userRepository, managementUserSecurityService), true)
    }

    def "should delete a user when root"() {
        given:
        def authorization = "authorization"
        def root = TestUtils.userRoot
        def user = TestUtils.user

        when:
        deleteUserInteractor.execute(user.id, authorization)

        then:
        1 * managementUserSecurityService.getUserEmail(authorization) >> root.email
        1 * userRepository.findByEmail(root.email) >> Optional.of(root)
        1 * userRepository.delete(user.id)
        1 * managementUserSecurityService.deleteUser(user.id)

        notThrown()
    }

    def "should delete himself when not root"() {
        given:
        def authorization = "authorization"
        def user = TestUtils.user

        when:
        deleteUserInteractor.execute("123", authorization)

        then:
        1 * managementUserSecurityService.getUserEmail(authorization) >> user.email
        1 * userRepository.findByEmail(user.email) >> Optional.of(user)
        1 * userRepository.delete(user.id)
        1 * managementUserSecurityService.deleteUser(user.id)

        notThrown()
    }

    def "should not delete a user when invalid user token"() {
        given:
        def authorization = "authorization"
        def root = TestUtils.userRoot
        def user = TestUtils.user

        when:
        deleteUserInteractor.execute(user.id, authorization)

        then:
        1 * managementUserSecurityService.getUserEmail(authorization) >> root.email
        1 * userRepository.findByEmail(root.getEmail()) >> Optional.empty()
        0 * userRepository.delete(user.id)
        0 * managementUserSecurityService.deleteUser(user.id)

        thrown(NotFoundException)
    }
}
