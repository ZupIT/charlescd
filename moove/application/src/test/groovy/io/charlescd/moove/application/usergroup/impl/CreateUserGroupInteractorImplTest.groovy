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

package io.charlescd.moove.application.usergroup.impl

import io.charlescd.moove.application.SystemTokenService
import io.charlescd.moove.application.TestUtils
import io.charlescd.moove.application.UserGroupService
import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.usergroup.CreateUserGroupInteractor
import io.charlescd.moove.application.usergroup.request.CreateUserGroupRequest
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.UserGroup
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.SystemTokenRepository
import io.charlescd.moove.domain.repository.UserGroupRepository
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.service.ManagementUserSecurityService
import spock.lang.Specification

import java.time.LocalDateTime

class CreateUserGroupInteractorImplTest extends Specification {

    private CreateUserGroupInteractor createUserGroupInteractor

    private UserGroupRepository userGroupRepository = Mock(UserGroupRepository)
    private UserRepository userRepository = Mock(UserRepository)
    private SystemTokenRepository systemTokenRepository = Mock(SystemTokenRepository)
    private SystemTokenService systemTokenService = new SystemTokenService(systemTokenRepository)
    private ManagementUserSecurityService managementUserSecurityService = Mock(ManagementUserSecurityService)

    void setup() {
        this.createUserGroupInteractor = new CreateUserGroupInteractorImpl(
                new UserGroupService(userGroupRepository),
                new UserService(userRepository, systemTokenService, managementUserSecurityService)
        )
    }

    def "when user does not exists should throw an exception"() {
        given:
        def author = TestUtils.user
        def authorization = TestUtils.authorization
        def createUserGroupRequest = new CreateUserGroupRequest("group-name")

        when:
        this.createUserGroupInteractor.execute(createUserGroupRequest, authorization, null)

        then:
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * userRepository.findByEmail(author.email) >> Optional.empty()

        def ex = thrown(NotFoundException)
        ex.resourceName == "user"
    }

    def "should create user group using authorization"() {
        given:
        def author = TestUtils.user
        def authorization = TestUtils.authorization
        def createUserGroupRequest = new CreateUserGroupRequest("group-name")

        when:
        def userGroupResponse = this.createUserGroupInteractor.execute(createUserGroupRequest, authorization, null)

        then:
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * userRepository.findByEmail(author.email) >> Optional.of(author)
        1 * this.userGroupRepository.save(_) >> { argument ->
            def savedUserGroup = argument[0]
            assert savedUserGroup instanceof UserGroup
            assert savedUserGroup.id != null
            assert savedUserGroup.name == createUserGroupRequest.name
            assert savedUserGroup.createdAt != null
            assert savedUserGroup.author.id == author.id
            assert savedUserGroup.users.size() == 0

            return savedUserGroup
        }

        notThrown()

        assert userGroupResponse != null
        assert userGroupResponse.id != null
        assert userGroupResponse.name == createUserGroupRequest.name
    }

    def "should create user group using system token"() {
        given:
        def author = TestUtils.user
        def systemTokenValue = TestUtils.systemTokenValue
        def systemTokenId = TestUtils.systemTokenId
        def createUserGroupRequest = new CreateUserGroupRequest("group-name")

        when:
        def userGroupResponse = this.createUserGroupInteractor.execute(createUserGroupRequest, null, systemTokenValue)

        then:
        1 * systemTokenRepository.getIdByTokenValue(systemTokenValue) >> systemTokenId
        1 * userRepository.findBySystemTokenId(systemTokenId) >> Optional.of(author)
        1 * this.userGroupRepository.save(_) >> { argument ->
            def savedUserGroup = argument[0]
            assert savedUserGroup instanceof UserGroup
            assert savedUserGroup.id != null
            assert savedUserGroup.name == createUserGroupRequest.name
            assert savedUserGroup.createdAt != null
            assert savedUserGroup.author.id == author.id
            assert savedUserGroup.users.size() == 0

            return savedUserGroup
        }

        notThrown()

        assert userGroupResponse != null
        assert userGroupResponse.id != null
        assert userGroupResponse.name == createUserGroupRequest.name
    }

}
