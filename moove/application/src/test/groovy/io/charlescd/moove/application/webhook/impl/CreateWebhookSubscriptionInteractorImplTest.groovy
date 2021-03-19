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

import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.WebhookService
import io.charlescd.moove.application.webhook.CreateWebhookSubscriptionInteractor
import io.charlescd.moove.application.webhook.request.CreateWebhookSubscriptionRequest
import io.charlescd.moove.domain.SimpleWebhookSubscription
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.service.HermesService
import io.charlescd.moove.domain.service.ManagementUserSecurityService
import spock.lang.Specification

class CreateWebhookSubscriptionInteractorImplTest extends Specification {

    private CreateWebhookSubscriptionInteractor createWebhookSubscriptionInteractor
    private HermesService hermesService = Mock(HermesService)
    private UserRepository userRepository = Mock(UserRepository)
    private ManagementUserSecurityService managementUserSecurityService = Mock(ManagementUserSecurityService)

    def setup() {
        createWebhookSubscriptionInteractor = new CreateWebhookSubscriptionInteractorImpl(new WebhookService(new UserService(userRepository, managementUserSecurityService)), hermesService)
    }

    def "when trying to create subscription should do it successfully"() {
        when:
        createWebhookSubscriptionInteractor.execute(workspaceId, authorization, createWebhookSubscriptionRequest)

        then:
        1 * this.managementUserSecurityService.getUserEmail(authorization) >> authorEmail
        1 * this.hermesService.subscribe(authorEmail, simpleWebhookSubscription) >> subscriptionId

        notThrown()
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

    private static CreateWebhookSubscriptionRequest getCreateWebhookSubscriptionRequest() {
        return new CreateWebhookSubscriptionRequest('https://mywebhook.com.br', 'secret',
                'My Webhook', events)
    }

    private static SimpleWebhookSubscription getSimpleWebhookSubscription() {
        return new SimpleWebhookSubscription('https://mywebhook.com.br', 'secret', 'workspaceId',
                'My Webhook', events)
    }
}
