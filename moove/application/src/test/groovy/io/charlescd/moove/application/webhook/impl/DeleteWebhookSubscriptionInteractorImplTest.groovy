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
import io.charlescd.moove.application.webhook.DeleteWebhookSubscriptionInteractor
import io.charlescd.moove.domain.SimpleWebhookSubscription
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.service.HermesService
import io.charlescd.moove.domain.service.ManagementUserSecurityService
import spock.lang.Specification

class DeleteWebhookSubscriptionInteractorImplTest extends Specification {

    private DeleteWebhookSubscriptionInteractor deleteWebhookSubscriptionInteractor
    private HermesService hermesService = Mock(HermesService)
    private ManagementUserSecurityService managementUserSecurityService = Mock(ManagementUserSecurityService)

    def setup() {
        deleteWebhookSubscriptionInteractor = new DeleteWebhookSubscriptionInteractorImpl(new WebhookService(hermesService, managementUserSecurityService))
    }

    def "when trying to delete subscription should do it successfully"() {
        when:
        deleteWebhookSubscriptionInteractor.execute(workspaceId, subscriptionId, authorization)

        then:
        1 * this.managementUserSecurityService.getUserEmail(authorization) >> authorEmail
        1 * this.hermesService.getSubscription(authorEmail, subscriptionId) >> simpleWebhookSubscription
        1 * this.hermesService.deleteSubscription(authorEmail, subscriptionId)
        notThrown()
    }

    def "when trying to delete subscription and is wrong workspace should throw not found exception"() {
        when:
        deleteWebhookSubscriptionInteractor.execute("workspaceIdOther", subscriptionId, authorization)

        then:
        1 * this.managementUserSecurityService.getUserEmail(authorization) >> authorEmail
        1 * this.hermesService.getSubscription(authorEmail, subscriptionId) >> simpleWebhookSubscription
        0 * this.hermesService.deleteSubscription(authorEmail, subscriptionId)
        thrown(NotFoundException)
    }

    private static List<String> getEvents() {
        def events = new ArrayList()
        events.add("DEPLOY")
        return events
    }

    private static String getAuthorEmail() {
        return "email@email.com"
    }

    private static String getAuthorization() {
        return "Bearer qwerty"
    }

    private static String getWorkspaceId() {
        return "workspaceId"
    }

    private static String getSubscriptionId() {
        return "subscriptionId"
    }

    private static SimpleWebhookSubscription getSimpleWebhookSubscription() {
        return new SimpleWebhookSubscription('https://mywebhook.com.br', 'workspaceId',
                'My Webhook', events)
    }
}
