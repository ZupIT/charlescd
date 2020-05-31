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

package io.charlescd.moove.legacy.moove.controller

import io.charlescd.moove.legacy.moove.service.DeploymentServiceLegacy
import spock.lang.Specification

class DeploymentControllerUnitTest extends Specification {

    private DeploymentController controller
    private String workspaceId = "workspace-id"
    private DeploymentServiceLegacy deploymentService = Mock(DeploymentServiceLegacy)

    def setup() {
        this.controller = new DeploymentController(deploymentService)
    }

    def 'should undeploy the release'() {

        given:
        def deploymentId = "fake-deployment-id"

        when:
        this.controller.undeploy(workspaceId,deploymentId)

        then:

        1 * this.deploymentService.undeploy(deploymentId, workspaceId)

    }
}
