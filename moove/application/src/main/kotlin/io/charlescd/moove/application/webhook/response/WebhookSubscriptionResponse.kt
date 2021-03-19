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

import io.charlescd.moove.domain.WebhookSubscription

data class WebhookSubscriptionResponse(
    val id: String,
    val url: String,
    val workspaceId: String,
    val description: String,
    val events: List<String>
) {
    companion object {
        fun from(webhookSubscription: WebhookSubscription) = WebhookSubscriptionResponse(
            id = webhookSubscription.id,
            url = webhookSubscription.url,
            description = webhookSubscription.description,
            workspaceId = webhookSubscription.workspaceId,
            events = webhookSubscription.events
        )
    }
}
