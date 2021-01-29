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

import com.google.gson.Gson
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.service.HermesService
import io.charlescd.moove.infrastructure.service.client.*
import io.charlescd.moove.infrastructure.service.client.request.*
import io.charlescd.moove.infrastructure.service.client.response.HermesHealthCheckSubscriptionResponse
import io.charlescd.moove.infrastructure.service.client.response.HermesSubscriptionResponse
import org.springframework.stereotype.Service

@Service
class HermesClientService(private val hermesClient: HermesClient, private val hermesPublisherClient: HermesPublisherClient) : HermesService {
    override fun subscribe(authorEmail: String, simpleWebhookSubscription: SimpleWebhookSubscription): String {
        val request = buildHermesSubscriptionCreateRequest(simpleWebhookSubscription)
        return hermesClient.subscribe(authorEmail, request).id
    }

    override fun getSubscription(authorEmail: String, id: String): WebhookSubscription {
        val subscription = hermesClient.getSubscription(authorEmail, id)
        return buildWebhookSubscription(subscription)
    }

    override fun getSubscriptinsByExternalId(authorEmail: String, externalId: String): List<WebhookSubscription> {
        val subscriptions = hermesClient.getSubscriptionsByExternalId(authorEmail, externalId)
        return subscriptions.map { buildWebhookSubscription(it) }
    }

    override fun updateSubscription(authorEmail: String, id: String, events: List<String>): WebhookSubscription {
        val request = buildHermesSubscriptionUpdateRequest(events)
        val subscription = hermesClient.updateSubscription(authorEmail, id, request)
        return buildWebhookSubscription(subscription)
    }

    override fun deleteSubscription(authorEmail: String, id: String) {
        hermesClient.deleteSubscription(authorEmail, id)
    }

    override fun healthCheckSubscription(authorEmail: String, id: String): HealthCheckWebhookSubscription {
        return buildHealthCheckWebhookSubscription(hermesClient.healthCheckSubscription(authorEmail, id))
    }

    override fun notifySubscriptionEvent(webhookEvent: WebhookEvent) {
        hermesPublisherClient.notifyEvent(buildHermesSubscriptionEventPublishRequest(webhookEvent))
    }

    private fun buildHermesSubscriptionEventPublishRequest(webhookEvent: WebhookEvent): HermesPublishSubscriptionEventRequest {
        return when (webhookEvent) {
            is WebhookDeploymentEventType -> buildHermesPublishSubscriptionEventRequest(webhookEvent)
            else -> (throw NotFoundException("WebhookEventTypeEnum", webhookEvent.toString()))
        }
    }

    override fun getSubscriptionHistory() {
        TODO("Not yet implemented")
    }

    private fun buildHermesSubscriptionCreateRequest(simpleWebhookSubscription: SimpleWebhookSubscription): HermesCreateSubscriptionRequest {
        return HermesCreateSubscriptionRequest(
            url = simpleWebhookSubscription.url,
            description = simpleWebhookSubscription.description,
            apiKey = simpleWebhookSubscription.apiKey,
            externalId = simpleWebhookSubscription.workspaceId,
            events = simpleWebhookSubscription.events
        )
    }

    private fun buildHermesSubscriptionUpdateRequest(events: List<String>): HermesUpdateSubscriptionRequest {
        return HermesUpdateSubscriptionRequest(
            events = events
        )
    }

    private fun buildWebhookSubscription(subscription: HermesSubscriptionResponse): WebhookSubscription {
        return WebhookSubscription(
            id = subscription.id,
            apiKey = subscription.apiKey,
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

    private fun buildHermesPublishSubscriptionEventRequest(webhookDeploymentEvent: WebhookDeploymentEventType): HermesPublishSubscriptionEventRequest {
        return HermesPublishSubscriptionEventRequest(
            eventType = webhookDeploymentEvent.eventType,
            externalId = webhookDeploymentEvent.externalId,
            event = Gson().toJson(webhookDeploymentEvent.event)
        )
    }
}
