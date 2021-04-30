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

import io.charlescd.moove.application.SystemTokenService
import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.user.FindWorkspaceByUserIdInteractor
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.Permission
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.WorkspacePermissions
import io.charlescd.moove.domain.WorkspaceStatusEnum
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.repository.SystemTokenRepository
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.service.KeycloakService
import io.charlescd.moove.domain.service.ManagementUserSecurityService
import spock.lang.Specification

import java.time.LocalDateTime

class FindWorkspaceByUserIdInteractorImplTest extends Specification {

    private FindWorkspaceByUserIdInteractor findWorkspaceByUserIdInteractor

    private UserRepository userRepository = Mock(UserRepository)

    private KeycloakService keycloakService = Mock(KeycloakService)

    private SystemTokenService systemTokenService = new SystemTokenService(Mock(SystemTokenRepository))

    private ManagementUserSecurityService managementUserSecurityService = Mock(ManagementUserSecurityService)

    void setup() {
        findWorkspaceByUserIdInteractor = new FindWorkspaceByUserIdInteractorImpl(new UserService(userRepository, systemTokenService, managementUserSecurityService),keycloakService)
    }

    def "should find an user by its id"() {
        given:
        def id = UUID.randomUUID()
        def authorization = "authorization"

        def author = new User("f52f94b8-6775-470f-bac8-125ebfd6b636", "zup", "zup@zup.com.br", "http://image.com.br/photo.png",
                [], false, LocalDateTime.now())

        def permission = new Permission("permission-id", "permission-name", LocalDateTime.now())
        def workspacePermission = new WorkspacePermissions("workspace-id", "workspace-name", [permission], author, LocalDateTime.now(), WorkspaceStatusEnum.COMPLETE)

        def user = new User(id.toString(), "user name", "user@zup.com.br", "http://image.com.br/photo.png",
                [workspacePermission], false, LocalDateTime.now())

        when:
        def response = findWorkspaceByUserIdInteractor.execute(authorization,id)

        then:
        1 * userRepository.findById(id.toString()) >> Optional.of(user)
        1 * userRepository.findByEmail("user@zup.com.br") >> Optional.of(user)
        1 * keycloakService.getEmailByAccessToken(authorization) >> user.getEmail()

        assert response != null
        assert response[0].id == workspacePermission.id
        assert response[0].name == workspacePermission.name
        assert response.size() == 1
        assert response[0].permissions.size() == workspacePermission.permissions.size()
        assert response[0].permissions[0] == workspacePermission.permissions[0].name
    }

    def "should find an user by its id, because the authorization its root"() {
        given:
        def id = UUID.randomUUID()
        def authorization = "authorization"

        def author = new User("f52f94b8-6775-470f-bac8-125ebfd6b636", "zup", "zup@zup.com.br", "http://image.com.br/photo.png",
                [], true, LocalDateTime.now())

        def permission = new Permission("permission-id", "permission-name", LocalDateTime.now())
        def workspacePermission = new WorkspacePermissions("workspace-id", "workspace-name", [permission], author, LocalDateTime.now(), WorkspaceStatusEnum.COMPLETE)

        def user = new User(id.toString(), "user name", "user@zup.com.br", "http://image.com.br/photo.png",
                [workspacePermission], false, LocalDateTime.now())

        when:
        def response = findWorkspaceByUserIdInteractor.execute(authorization,id)

        then:
        1 * userRepository.findById(id.toString()) >> Optional.of(user)
        1 * userRepository.findByEmail("zup@zup.com.br") >> Optional.of(author)
        1 * keycloakService.getEmailByAccessToken(authorization) >> author.getEmail()

        assert response != null
        assert response[0].id == workspacePermission.id
        assert response[0].name == workspacePermission.name
        assert response.size() == 1
        assert response[0].permissions.size() == workspacePermission.permissions.size()
        assert response[0].permissions[0] == workspacePermission.permissions[0].name
    }

    def "should raise exception because  because the authorization isn't root, or the owner of the data"() {
        given:
        def id = UUID.randomUUID()
        def authorization = "authorization"

        def author = new User("f52f94b8-6775-470f-bac8-125ebfd6b636", "zup", "zup@zup.com.br", "http://image.com.br/photo.png",
                [], false, LocalDateTime.now())

        def permission = new Permission("permission-id", "permission-name", LocalDateTime.now())
        def workspacePermission = new WorkspacePermissions("workspace-id", "workspace-name", [permission], author, LocalDateTime.now(), WorkspaceStatusEnum.COMPLETE)

        def user = new User(id.toString(), "user name", "user@zup.com.br", "http://image.com.br/photo.png",
                [workspacePermission], false, LocalDateTime.now())

        when:
        def response = findWorkspaceByUserIdInteractor.execute(authorization,id)

        then:
        1 * userRepository.findById(id.toString()) >> Optional.of(user)
        1 * userRepository.findByEmail("zup@zup.com.br") >> Optional.of(author)
        1 * keycloakService.getEmailByAccessToken(authorization) >> author.getEmail()

        def exception = thrown(BusinessException)
        exception.errorCode == MooveErrorCode.FORBIDDEN
    }

}
