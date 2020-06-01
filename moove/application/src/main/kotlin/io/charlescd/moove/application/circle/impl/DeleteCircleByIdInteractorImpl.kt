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

package io.charlescd.moove.application.circle.impl

import io.charlescd.moove.application.CircleService
import io.charlescd.moove.application.DeploymentService
import io.charlescd.moove.application.KeyValueRuleService
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.circle.DeleteCircleByIdInteractor
import io.charlescd.moove.domain.Circle
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.service.CircleMatcherService
import javax.inject.Named
import javax.transaction.Transactional

@Named
open class DeleteCircleByIdInteractorImpl(
    private val circleService: CircleService,
    private val circleMatcherService: CircleMatcherService,
    private val deploymentService: DeploymentService,
    private val keyValueRuleService: KeyValueRuleService,
    private val workspaceService: WorkspaceService
) : DeleteCircleByIdInteractor {

    @Transactional
    override fun execute(id: String, workspaceId: String) {
        val circle = circleService.find(id, workspaceId)
        deleteDeployments(id)
        keyValueRuleService.delete(id)
        circleService.delete(id)
        deleteFromCircleMatcher(workspaceId, circle)
    }

    private fun deleteFromCircleMatcher(workspaceId: String, circle: Circle) {
        val workspace = workspaceService.find(workspaceId)
        circleMatcherService.delete(circle.reference, workspace.circleMatcherUrl!!)
    }

    private fun deleteDeployments(circleId: String) {
        if (deploymentService.findActiveList(circleId).isNotEmpty()) {
            throw BusinessException.of(MooveErrorCode.CIRCLE_DEPLOYMENT_ACTIVE)
        }

        deploymentService.deleteByCircleId(circleId)
    }
}
