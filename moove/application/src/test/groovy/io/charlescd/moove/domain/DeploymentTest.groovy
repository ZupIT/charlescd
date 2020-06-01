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

package io.charlescd.moove.domain

import io.charlescd.moove.domain.*
import spock.lang.Specification

import java.time.LocalDateTime

class DeploymentTest extends Specification {

    def 'when evaluating if deployment is active, should do it correctly'(Deployment deployment, Boolean result) {
        expect:
        deployment.isActive() == result

        where:
        deployment                                                                  | result
        getDummyDeployment(DeploymentStatusEnum.DEPLOYED, 'Circle Name', false)     | true
        getDummyDeployment(DeploymentStatusEnum.DEPLOYING, 'Circle Name', false)    | true
        getDummyDeployment(DeploymentStatusEnum.DEPLOYING, 'Default', true)         | false
        getDummyDeployment(DeploymentStatusEnum.NOT_DEPLOYED, 'Default', true)      | false
        getDummyDeployment(DeploymentStatusEnum.NOT_DEPLOYED, 'Circle Name', false) | false
        getDummyDeployment(DeploymentStatusEnum.DEPLOY_FAILED, 'Circle Name', false) | false
        getDummyDeployment(DeploymentStatusEnum.UNDEPLOYING, 'Circle Name', false)   | false
    }

    private Deployment getDummyDeployment(DeploymentStatusEnum deploymentStatus, String circleName, Boolean isDefault) {

        def workspaceId = 'b49c3575-c842-4cbb-8d41-bcad7c42091f'
        def author = new User('7bdbca7a-a0dc-4721-a861-198b238c0e32', "charles", "charles@zup.com.br", "http://charles.com/dummy_photo.jpg", [], false, LocalDateTime.now())

        def circle = new Circle('f8296cfc-6ae1-11ea-bc55-0242ac130003', circleName, 'f8296df6-6ae1-11ea-bc55-0242ac130003',
                author, LocalDateTime.now(), MatcherTypeEnum.SIMPLE_KV, null, null, null, isDefault, "1a58c78a-6acb-11ea-bc55-0242ac130003")

        return new Deployment('f8296aea-6ae1-11ea-bc55-0242ac130003', author, LocalDateTime.now().minusDays(1),
                LocalDateTime.now(), deploymentStatus, circle, '23f1eabd-fb57-419b-a42b-4628941e34ec', workspaceId)
    }
}
