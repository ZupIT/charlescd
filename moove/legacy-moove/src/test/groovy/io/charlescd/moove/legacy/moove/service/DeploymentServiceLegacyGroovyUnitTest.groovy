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

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import io.charlescd.moove.legacy.moove.api.DeployApi
import io.charlescd.moove.legacy.moove.api.response.UndeployResponse
import io.charlescd.moove.legacy.repository.BuildRepository
import io.charlescd.moove.legacy.repository.CircleRepository
import io.charlescd.moove.legacy.repository.DeploymentRepository
import io.charlescd.moove.legacy.repository.UserRepository
import io.charlescd.moove.legacy.repository.entity.*
import spock.lang.Specification

import java.time.LocalDateTime

class DeploymentServiceLegacyGroovyUnitTest extends Specification {

    private String workspaceId = "workspace-id"
    private DeploymentServiceLegacy service
    private JsonNode jsonNode = new ObjectMapper().createObjectNode()
    private DeploymentRepository deploymentRepository = Mock(DeploymentRepository)
    private UserRepository userRepository = Mock(UserRepository)
    private BuildRepository buildRepository = Mock(BuildRepository)
    private CircleRepository circleRepository = Mock(CircleRepository)
    private DeployApi deployApi = Mock(DeployApi)

    def setup() {
        this.service = new DeploymentServiceLegacy(deploymentRepository, userRepository, buildRepository, circleRepository, deployApi)
        this.service.MOOVE_BASE_PATH = "http://fake-moove/base-path"
    }

    def 'should do the undeploy of a release'() {

        given:
        User user = new User(
                "user-id",
                "zup-user",
                "zup-user@zup.com.br",
                "http://zup-user.com/user.jpg",
                false,
                LocalDateTime.now()
        )
        Hypothesis hypothesis = createHypothesis("hypothesis-a", user)

        CardColumn cardColumn = new CardColumn("card-column-id", "card-column-name", hypothesis, "workspace-id")

        Build build = new Build("build-id",
                user,
                LocalDateTime.now(),
                [],
                "build-tag",
                null,
                cardColumn,
                BuildStatus.BUILT,
                workspaceId,
                [])

        Circle circle = new Circle("circle-id",
                "woman",
                "reference",
                user,
                LocalDateTime.now(),
                MatcherType.SIMPLE_KV,
                this.jsonNode,
                1000, LocalDateTime.now())

        Deployment deployment = new Deployment("deployment-id",
                user,
                LocalDateTime.now(),
                LocalDateTime.now(),
                DeploymentStatus.DEPLOYED,
                circle,
                build,
                workspaceId
        )

        Deployment updatedDeployment = new Deployment("deployment-id",
                user,
                LocalDateTime.now(),
                LocalDateTime.now(),
                DeploymentStatus.UNDEPLOYING,
                circle,
                build,
                workspaceId)

        when:
        this.service.undeploy("deployment-id", workspaceId)

        then:
        this.deploymentRepository.findByIdAndWorkspaceId(_, _) >> Optional.ofNullable(deployment)
        this.deploymentRepository.save(_) >> updatedDeployment
        this.deployApi.undeploy(_, _) >> new UndeployResponse("deployment-id")

    }

    private Hypothesis createHypothesis(String hypothesisId, User user) {
        new Hypothesis(
                hypothesisId,
                "hyp-name",
                "hyp-description",
                user,
                LocalDateTime.now(),
                [],
                [],
                [],
                "workspace-id"
        )
    }
}
