/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.domain

import spock.lang.Specification

import java.time.LocalDateTime

class DeploymentTest extends Specification {

    def 'when evaluating if deployment is active, should do it correctly'(Deployment deployment, Boolean result) {
        expect:
        deployment.isActive() == result

        where:
        deployment                                                            | result
        getDummyDeployment(DeploymentStatusEnum.DEPLOYED, 'Circle Name')      | true
        getDummyDeployment(DeploymentStatusEnum.DEPLOYING, 'Circle Name')     | true
        getDummyDeployment(DeploymentStatusEnum.DEPLOYING, 'Default')         | false
        getDummyDeployment(DeploymentStatusEnum.NOT_DEPLOYED, 'Default')      | false
        getDummyDeployment(DeploymentStatusEnum.NOT_DEPLOYED, 'Circle Name')  | false
        getDummyDeployment(DeploymentStatusEnum.DEPLOY_FAILED, 'Circle Name') | false
        getDummyDeployment(DeploymentStatusEnum.UNDEPLOYING, 'Circle Name')   | false
    }

    private Deployment getDummyDeployment(DeploymentStatusEnum deploymentStatus, String circleName) {

        def applicationId = 'b49c3575-c842-4cbb-8d41-bcad7c42091f'
        def author = new User('7bdbca7a-a0dc-4721-a861-198b238c0e32', "charles", "charles@zup.com.br", "http://charles.com/dummy_photo.jpg", [], LocalDateTime.now())

        def circle = new Circle('f8296cfc-6ae1-11ea-bc55-0242ac130003', circleName, 'f8296df6-6ae1-11ea-bc55-0242ac130003',
                author, LocalDateTime.now(), MatcherTypeEnum.SIMPLE_KV, null, null, null)

        return new Deployment('f8296aea-6ae1-11ea-bc55-0242ac130003', author, LocalDateTime.now().minusDays(1),
                LocalDateTime.now(), deploymentStatus, circle, '23f1eabd-fb57-419b-a42b-4628941e34ec', applicationId)
    }
}
