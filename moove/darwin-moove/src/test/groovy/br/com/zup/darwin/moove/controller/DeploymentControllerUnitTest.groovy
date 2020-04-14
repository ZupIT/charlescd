/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.controller

import br.com.zup.darwin.moove.service.DeploymentService
import spock.lang.Specification

class DeploymentControllerUnitTest extends Specification {

    private DeploymentController controller
    private String applicationId = "application-id"
    private DeploymentService deploymentService = Mock(DeploymentService)

    def setup() {
        this.controller = new DeploymentController(deploymentService)
    }

    def 'should undeploy the release'() {

        given:
        def deploymentId = "fake-deployment-id"

        when:
        this.controller.undeploy(applicationId,deploymentId)

        then:

        1 * this.deploymentService.undeploy(deploymentId, applicationId)

    }

}
