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

package io.charlescd.moove.application.workspace.impl

import io.charlescd.moove.application.*
import io.charlescd.moove.application.workspace.FindWorkspaceInteractor
import io.charlescd.moove.application.workspace.response.WorkspaceResponse
import javax.inject.Inject
import javax.inject.Named

@Named
class FindWorkspaceInteractorImpl @Inject constructor(
    private val workspaceService: WorkspaceService,
    private val gitConfigurationService: GitConfigurationService,
    private val registryConfigurationService: RegistryConfigurationService,
    private val cdConfigurationService: CdConfigurationService,
    private val metricConfigurationService: MetricConfigurationService
) : FindWorkspaceInteractor {

    override fun execute(workspaceId: String): WorkspaceResponse {
        val workspace = workspaceService.find(workspaceId)

        val gitConfiguration =
            workspace.gitConfigurationId?.let { gitConfigurationService.find(workspace.gitConfigurationId!!) }

        val registryConfiguration = workspace.registryConfigurationId?.let {
            registryConfigurationService.findByName(
                workspace.registryConfigurationId!!,
                workspace.id
            )
        }

        val cdConfiguration = workspace.cdConfigurationId?.let {
            cdConfigurationService.find(workspace.id, workspace.cdConfigurationId!!)
        }

        val metricConfiguration = workspace.metricConfigurationId?.let {
            metricConfigurationService.find(workspace.metricConfigurationId!!, workspace.id)
        }

        return WorkspaceResponse.from(
            workspace,
            gitConfiguration,
            registryConfiguration,
            cdConfiguration,
            metricConfiguration
        )
    }

}
