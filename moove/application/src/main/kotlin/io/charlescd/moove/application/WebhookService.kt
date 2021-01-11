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

package io.charlescd.moove.application

import io.charlescd.moove.domain.SimpleWebhookSubscription
import io.charlescd.moove.domain.WebhookSubscription
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.service.HermesService
import io.charlescd.moove.domain.service.ManagementUserSecurityService
import javax.inject.Named

@Named
class WebhookService(private val hermesService: HermesService, private val userSecurityService: ManagementUserSecurityService) {

    fun subscribe(authorization: String, webhookSubscription: WebhookSubscription): String {
        return hermesService.subscribe(getAuthorEmail(authorization), webhookSubscription)
    }

    fun getSubscription(workspaceId: String, authorization: String, id: String): SimpleWebhookSubscription {
        val authorEmail = getAuthorEmail(authorization)
        return getSubscriptionByIdAndWorkspace(workspaceId, authorEmail, id)
    }

    fun updateSubscription(workspaceId: String, authorization: String, id: String, events: List<String>): SimpleWebhookSubscription {
        val authorEmail = getAuthorEmail(authorization)
        getSubscriptionByIdAndWorkspace(workspaceId, authorEmail, id)
        return hermesService.updateSubscription(authorEmail, id, events)
    }

    fun deleteSubscription(workspaceId: String, authorization: String, id: String) {
        val authorEmail = getAuthorEmail(authorization)
        getSubscriptionByIdAndWorkspace(workspaceId, authorEmail, id)
        hermesService.deleteSubscription(authorEmail, id)
    }

    private fun getAuthorEmail(authorization: String): String {
        return userSecurityService.getUserEmail(authorization)
    }

    private fun getSubscriptionByIdAndWorkspace(workspaceId: String, authorEmail: String, id: String): SimpleWebhookSubscription {
        val subscription = hermesService.getSubscription(authorEmail, id)
        validateWorkspace(workspaceId, id, subscription)
        return subscription
    }

    private fun validateWorkspace(workspaceId: String, id: String, subscription: SimpleWebhookSubscription) {
        if (subscription.workspaceId != workspaceId) {
            throw NotFoundException("subscription", id)
        }
    }
}
