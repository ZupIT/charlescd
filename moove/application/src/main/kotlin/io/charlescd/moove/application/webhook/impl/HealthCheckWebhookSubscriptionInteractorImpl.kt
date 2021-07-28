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

package io.charlescd.moove.application.webhook.impl

import io.charlescd.moove.application.WebhookService
import io.charlescd.moove.application.webhook.HealthCheckWebhookSubscriptionInteractor
import io.charlescd.moove.application.webhook.response.HealthCheckWebhookSubscriptionResponse
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.WebhookSubscriptionHealthCheck
import io.charlescd.moove.domain.service.HermesService
import javax.inject.Inject
import javax.inject.Named

@Named
class HealthCheckWebhookSubscriptionInteractorImpl @Inject constructor(
    private val webhookService: WebhookService,
    private val hermesService: HermesService
) : HealthCheckWebhookSubscriptionInteractor {

    override fun execute(workspaceId: String, authorization: String?, token: String?, id: String): HealthCheckWebhookSubscriptionResponse {
        val healthCheckWebhookSubscription = healthCheckSubscription(workspaceId, authorization, token, id)
        return HealthCheckWebhookSubscriptionResponse.from(healthCheckWebhookSubscription)
    }

    private fun healthCheckSubscription(
        workspaceId: String,
        authorization: String?,
        token: String?,
        id: String
    ): WebhookSubscriptionHealthCheck {
        val author = webhookService.getAuthor(authorization, token)
        validateSubscription(workspaceId, author, id)
        return hermesService.healthCheckSubscription(author.email, id)
    }

    private fun validateSubscription(workspaceId: String, author: User, id: String) {
        val subscription = hermesService.getSubscription(author.email, id)
        webhookService.validateWorkspace(workspaceId, id, author, subscription)
    }
}
