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
import io.charlescd.moove.domain.WebhookConfiguration
import io.charlescd.moove.domain.WebhookConfigurationLastDelivery
import io.charlescd.moove.domain.service.HermesService
import javax.inject.Inject
import javax.inject.Named
import org.slf4j.LoggerFactory

@Named
class FindWorkspaceInteractorImpl @Inject constructor(
    private val workspaceService: WorkspaceService,
    private val gitConfigurationService: GitConfigurationService,
    private val registryConfigurationService: RegistryConfigurationService,
    private val metricConfigurationService: MetricConfigurationService,
    private val deploymentConfigurationService: DeploymentConfigurationService,
    private val hermesService: HermesService,
    private val userService: UserService
) : FindWorkspaceInteractor {

    private val logger = LoggerFactory.getLogger(this.javaClass)

    override fun execute(workspaceId: String, authorization: String): WorkspaceResponse {
        val workspace = workspaceService.find(workspaceId)

        val gitConfiguration =
            workspace.gitConfigurationId?.let { gitConfigurationService.find(workspace.gitConfigurationId!!) }

        val registryConfiguration = workspace.registryConfigurationId?.let {
            registryConfigurationService.findByName(
                workspace.registryConfigurationId!!,
                workspace.id
            )
        }

        val deploymentConfiguration = workspace.deploymentConfigurationId?.let {
            deploymentConfigurationService.find(workspace.deploymentConfigurationId!!)
        }

        val metricConfiguration = workspace.metricConfigurationId?.let {
            metricConfigurationService.find(workspace.metricConfigurationId!!, workspace.id)
        }

        val webhookConfiguration = getWebhookConfiguration(authorization, workspaceId)

        return WorkspaceResponse.from(
            workspace,
            gitConfiguration,
            registryConfiguration,
            metricConfiguration,
            deploymentConfiguration,
            webhookConfiguration
        )
    }

    private fun getWebhookConfiguration(authorization: String, workspaceId: String): List<WebhookConfiguration> {
        try {
            val authorEmail = userService.getEmailFromToken(authorization)
            val subscriptions = hermesService.getSubscriptinsByExternalId(authorEmail, workspaceId)
            return subscriptions.map {
                WebhookConfiguration(
                    id = it.id,
                    description = it.description,
                    url = it.url,
                    workspaceId = it.workspaceId,
                    events = it.events,
                    lastDelivery = buildWebhookLastDelivery(authorEmail, it.id)
                )
            }
        } catch (ex: Exception) {
            logger.error("Failed to get webhook info" + ex.message)
        }
        return emptyList()
    }

    private fun buildWebhookLastDelivery(authorEmail: String, subscriptionId: String): WebhookConfigurationLastDelivery {
        val healthCheckSubscription = hermesService.healthCheckSubscription(authorEmail, subscriptionId)
        return WebhookConfigurationLastDelivery(
            status = healthCheckSubscription.status,
            details = healthCheckSubscription.details
        )
    }
}
