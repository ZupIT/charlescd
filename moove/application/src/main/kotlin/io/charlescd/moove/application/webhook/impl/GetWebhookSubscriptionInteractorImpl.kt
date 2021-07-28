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
import io.charlescd.moove.application.webhook.response.WebhookSubscriptionResponse
import io.charlescd.moove.domain.WebhookSubscription
import io.charlescd.moove.domain.service.HermesService
import javax.inject.Inject
import javax.inject.Named

@Named
class GetWebhookSubscriptionInteractorImpl @Inject constructor(
    private val webhookService: WebhookService,
    private val hermesService: HermesService
) : GetWebhookSubscriptionInteractor {
    override fun execute(workspaceId: String, authorization: String?, token: String?, id: String): WebhookSubscriptionResponse {
        val webhookSubscription = getSubscription(workspaceId, authorization, token, id)
        return WebhookSubscriptionResponse.from(webhookSubscription)
    }

    private fun getSubscription(workspaceId: String, authorization: String?, token: String?, id: String): WebhookSubscription {
        val author = webhookService.getAuthor(authorization, token)
        val subscription = hermesService.getSubscription(author.email, id)
        webhookService.validateWorkspace(workspaceId, id, author, subscription)
        return subscription
    }
}
