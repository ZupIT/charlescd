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
import io.charlescd.moove.application.webhook.GetWebhookSubscriptionInteractor
import io.charlescd.moove.application.webhook.response.SimpleWebhookSubscriptionResponse
import javax.inject.Inject
import javax.inject.Named

@Named
class GetWebhookSubscriptionInteractorImpl @Inject constructor(
    private val webhookService: WebhookService
) : GetWebhookSubscriptionInteractor {
    override fun execute(workspaceId: String, id: String, authorization: String): SimpleWebhookSubscriptionResponse {
        val webhookSubscription = webhookService.getSubscription(workspaceId, authorization, id)
        return SimpleWebhookSubscriptionResponse.from(webhookSubscription)
    }
}
