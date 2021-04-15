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

package io.charlescd.moove.application.deployment.impl

import io.charlescd.moove.application.TestUtils
import io.charlescd.moove.application.UserService
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.service.ManagementUserSecurityService
import io.charlescd.moove.infrastructure.service.client.DeployClient
import io.charlescd.moove.infrastructure.service.client.response.Log
import io.charlescd.moove.infrastructure.service.client.response.LogResponse
import spock.lang.Specification

import java.time.LocalDateTime

class FindDeploymentLogsInteractorTest extends Specification {
    def userRepository = Mock(UserRepository)
    def  managementUserSecurityService = Mock(ManagementUserSecurityService)
    def userService = new UserService(userRepository, managementUserSecurityService)
    def deployClient = Mock(DeployClient)

    def findDeploymentLogsInteractor = new FindDeploymentLogsInteractorImpl(userService, deployClient)


    def 'should return the correct log response '() {
        given:
        def workspaceId = TestUtils.workspaceId
        def authorization = TestUtils.authorization
        def deploymentId = '083337ef-6177-4a24-b32e-f7429336ec20'
        def log = new Log("INFO", "log title", "log details", LocalDateTime.now().toString())
        def logResponse = new LogResponse(
                "id",
                [log]
        )
        when:
        def response = findDeploymentLogsInteractor.execute(workspaceId, authorization, deploymentId)
        then:
        1 * deployClient.getDeploymentLogs(workspaceId, deploymentId) >> logResponse
        1 * managementUserSecurityService.getUserEmail(authorization) >> TestUtils.email
        1 * userRepository.findByEmail(TestUtils.email) >> Optional.of(TestUtils.user)
        assert response.logs.size() == logResponse.logs.size()
        assert response.logs[0].title == logResponse.logs[0].title
        assert response.logs[0].details == logResponse.logs[0].details

    }

    def 'when user is not found by authorization token should throw exception'() {
        given:
        def workspaceId = TestUtils.workspaceId
        def authorization = TestUtils.authorization
        def deploymentId = '083337ef-6177-4a24-b32e-f7429336ec20'

        when:
         findDeploymentLogsInteractor.execute(workspaceId, authorization, deploymentId)
        then:
        1 * managementUserSecurityService.getUserEmail(authorization) >> TestUtils.email
        1 * userRepository.findByEmail(TestUtils.email) >> Optional.empty()
        0 * deployClient.getDeploymentLogs(workspaceId, deploymentId)
        thrown(NotFoundException)
    }

}
