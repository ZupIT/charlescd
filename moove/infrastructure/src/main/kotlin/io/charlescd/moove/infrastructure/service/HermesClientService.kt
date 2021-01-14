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

package io.charlescd.moove.infrastructure.service

import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.service.HermesService
import io.charlescd.moove.infrastructure.service.client.*
import io.charlescd.moove.infrastructure.service.client.request.*
import io.charlescd.moove.infrastructure.service.client.response.HermesHealthCheckSubscriptionResponse
import io.charlescd.moove.infrastructure.service.client.response.HermesSubscriptionResponse
import org.springframework.stereotype.Service

@Service
class HermesClientService(private val hermesClient: HermesClient) : HermesService {
    override fun subscribe(authorEmail: String, webhookSubscription: WebhookSubscription): String {
        val request = buildHermesSubscriptionCreateRequest(webhookSubscription)
        return hermesClient.subscribe(authorEmail, request).id
    }

    override fun getSubscription(authorEmail: String, id: String): SimpleWebhookSubscription {
        val subscription = hermesClient.getSubscription(authorEmail, id)
        return buildSimpleWebhookSubscription(subscription)
    }

    override fun updateSubscription(authorEmail: String, id: String, events: List<String>): SimpleWebhookSubscription {
        val request = buildHermesSubscriptionUpdateRequest(events)
        val subscription = hermesClient.updateSubscription(authorEmail, id, request)
        return buildSimpleWebhookSubscription(subscription)
    }

    override fun deleteSubscription(authorEmail: String, id: String) {
        hermesClient.deleteSubscription(authorEmail, id)
    }

    override fun healthCheckSubscription(authorEmail: String, id: String): HealthCheckWebhookSubscription {
        return buildHealthCheckWebhookSubscription(hermesClient.healthCheckSubscription(authorEmail, id))
    }

    override fun getSubscriptionHistory() {
        TODO("Not yet implemented")
    }

    override fun publishSubscription() {
        TODO("Not yet implemented")
    }

    private fun buildHermesSubscriptionCreateRequest(webhookSubscription: WebhookSubscription): HermesSubscriptionCreateRequest {
        return HermesSubscriptionCreateRequest(
            url = webhookSubscription.url,
            description = webhookSubscription.description,
            apiKey = webhookSubscription.apiKey,
            externalId = webhookSubscription.workspaceId,
            events = webhookSubscription.events
        )
    }

    private fun buildHermesSubscriptionUpdateRequest(events: List<String>): HermesSubscriptionUpdateRequest {
        return HermesSubscriptionUpdateRequest(
            events = events
        )
    }

    private fun buildSimpleWebhookSubscription(subscription: HermesSubscriptionResponse): SimpleWebhookSubscription {
        return SimpleWebhookSubscription(
            url = subscription.url,
            description = subscription.description,
            workspaceId = subscription.externalId,
            events = subscription.events
        )
    }

    private fun buildHealthCheckWebhookSubscription(healthCheck: HermesHealthCheckSubscriptionResponse): HealthCheckWebhookSubscription {
        return HealthCheckWebhookSubscription(
            status = healthCheck.status,
            details = healthCheck.details
        )
    }
}
