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
import io.charlescd.moove.application.webhook.CreateWebhookSubscriptionInteractor
import io.charlescd.moove.application.webhook.request.CreateWebhookSubscriptionRequest
import io.charlescd.moove.application.webhook.response.CreateWebhookSubscriptionResponse
import io.charlescd.moove.domain.SimpleWebhookSubscription
import io.charlescd.moove.domain.service.HermesService
import javax.inject.Inject
import javax.inject.Named

@Named
class CreateWebhookSubscriptionInteractorImpl @Inject constructor(
    private val webhookService: WebhookService,
    private val hermesService: HermesService
) : CreateWebhookSubscriptionInteractor {

    override fun execute(
        workspaceId: String,
        authorization: String?,
        token: String?,
        request: CreateWebhookSubscriptionRequest
    ): CreateWebhookSubscriptionResponse {
        val webhookSubscriptionId = subscribe(authorization, token, request.toSimpleWebhookSubscription(workspaceId))
        return CreateWebhookSubscriptionResponse.from(webhookSubscriptionId)
    }

    private fun subscribe(authorization: String?, token: String?, simpleWebhookSubscription: SimpleWebhookSubscription): String {
        return hermesService.subscribe(webhookService.getAuthor(authorization, token).email, simpleWebhookSubscription)
    }
}
