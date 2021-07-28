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

package io.charlescd.moove.application.webhook.response

import io.charlescd.moove.domain.WebhookSubscriptionEventHistory
import java.time.LocalDateTime

data class EventHistoryWebhookSubscriptionResponse(
    val executionId: String,
    val subscription: WebhookSubscriptionInfoResponse,
    val status: String,
    val event: WebhookEventInfoResponse,
    val executions: List<WebhookExecutionInfoResponse>
) {
    companion object {
        fun from(webhookSubscriptionEventHistory: WebhookSubscriptionEventHistory) = EventHistoryWebhookSubscriptionResponse(
            executionId = webhookSubscriptionEventHistory.executionId,
            subscription = WebhookSubscriptionInfoResponse(
                webhookSubscriptionEventHistory.subscription.id,
                webhookSubscriptionEventHistory.subscription.description,
                webhookSubscriptionEventHistory.subscription.url,
                webhookSubscriptionEventHistory.subscription.workspaceId

            ),
            status = webhookSubscriptionEventHistory.status,
            event = WebhookEventInfoResponse(
                webhookSubscriptionEventHistory.event.type,
                webhookSubscriptionEventHistory.event.content
            ),
            executions = webhookSubscriptionEventHistory.executions.map {
                WebhookExecutionInfoResponse(
                    it.executionLog,
                    it.status,
                    it.loggedAt
                )
            }
        )
    }
}

data class WebhookSubscriptionInfoResponse(
    val id: String,
    val description: String,
    val url: String,
    val workspaceId: String
)

data class WebhookEventInfoResponse(
    val type: String,
    val content: String
)

data class WebhookExecutionInfoResponse(
    val executionLog: String,
    val status: String,
    val loggedAt: LocalDateTime
)
