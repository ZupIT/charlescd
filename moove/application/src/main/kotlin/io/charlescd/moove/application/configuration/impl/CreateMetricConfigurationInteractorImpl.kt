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

package io.charlescd.moove.application.configuration.impl

import io.charlescd.moove.application.MetricConfigurationService
import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.configuration.CreateMetricConfigurationInteractor
import io.charlescd.moove.application.configuration.request.CreateMetricConfigurationRequest
import io.charlescd.moove.application.configuration.response.MetricConfigurationResponse
import javax.inject.Inject
import javax.inject.Named

@Named
class CreateMetricConfigurationInteractorImpl @Inject constructor(
    private val workspaceService: WorkspaceService,
    private val userService: UserService,
    private val metricConfigurationService: MetricConfigurationService
) : CreateMetricConfigurationInteractor {

    override fun execute(request: CreateMetricConfigurationRequest, workspaceId: String): MetricConfigurationResponse {
        workspaceService.checkIfWorkspaceExists(workspaceId)
        val author = userService.find(request.authorId)

        return MetricConfigurationResponse.from(
            metricConfigurationService.save(
                request.toMetricConfiguration(
                    workspaceId,
                    author
                )
            )
        )
    }
}
