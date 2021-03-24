/*
 *
 *  Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

package io.charlescd.moove.domain.service

import io.charlescd.moove.domain.*

interface HermesService {

    fun subscribe(authorEmail: String, simpleWebhookSubscription: SimpleWebhookSubscription): String

    fun getSubscription(authorEmail: String, id: String): WebhookSubscription

    fun getSubscriptinsByExternalId(authorEmail: String, externalId: String): List<WebhookSubscription>

    fun updateSubscription(authorEmail: String, id: String, events: List<String>): WebhookSubscription

    fun deleteSubscription(authorEmail: String, id: String)

    fun healthCheckSubscription(authorEmail: String, id: String): WebhookSubscriptionHealthCheck

    fun notifySubscriptionEvent(webhookEvent: WebhookEvent)

    fun getSubscriptionEventHistory(
        authorEmail: String,
        id: String,
        eventType: String?,
        eventStatus: String?,
        eventField: String?,
        eventValue: String?,
        pageRequest: PageRequest
    ): List<WebhookSubscriptionEventHistory>
}
