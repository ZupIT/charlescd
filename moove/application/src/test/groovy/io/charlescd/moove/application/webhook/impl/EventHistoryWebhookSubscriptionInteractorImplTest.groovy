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

import io.charlescd.moove.application.SystemTokenService
import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.WebhookService
import io.charlescd.moove.application.webhook.EventHistoryWebhookSubscriptionInteractor
import io.charlescd.moove.domain.PageRequest
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.WebhookEventInfo
import io.charlescd.moove.domain.WebhookExecutionInfo
import io.charlescd.moove.domain.WebhookSubscription
import io.charlescd.moove.domain.WebhookSubscriptionEventHistory
import io.charlescd.moove.domain.WebhookSubscriptionInfo
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.SystemTokenRepository
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.service.HermesService
import io.charlescd.moove.domain.service.ManagementUserSecurityService
import spock.lang.Specification

import java.time.LocalDateTime

class EventHistoryWebhookSubscriptionInteractorImplTest extends Specification {

    private EventHistoryWebhookSubscriptionInteractor eventHistoryWebhookSubscriptionInteractor
    private HermesService hermesService = Mock(HermesService)
    private UserRepository userRepository = Mock(UserRepository)
    private SystemTokenService systemTokenService = new SystemTokenService(Mock(SystemTokenRepository))
    private ManagementUserSecurityService managementUserSecurityService = Mock(ManagementUserSecurityService)

    def setup() {
        eventHistoryWebhookSubscriptionInteractor = new EventHistoryWebhookSubscriptionInteractorImpl(new WebhookService(new UserService(userRepository, systemTokenService, managementUserSecurityService)), hermesService)
    }

    def "when trying to get subscription event history should do it successfully"() {
        given:
        def response = new ArrayList()
        def history = new WebhookSubscriptionEventHistory(
                "executionId",
                new WebhookSubscriptionInfo(
                        subscriptionId,
                        "subscriptionDescription",
                        "subscriptionUrl",
                        workspaceId
                ),
                "ENQUEUED",
                new WebhookEventInfo(
                        "DEPLOY",
                        "json"
                ),
                new ArrayList<WebhookExecutionInfo>()
        )
        response.add(history)

        def pageRequest = new PageRequest()

        when:
        eventHistoryWebhookSubscriptionInteractor.execute(workspaceId, authorization, null, subscriptionId, "DEPLOY", null, null, null, pageRequest)

        then:
        1 * this.managementUserSecurityService.getUserEmail(authorization) >> authorEmail
        1 * this.userRepository.findByEmail(authorEmail) >> Optional.of(author)
        1 * this.hermesService.getSubscription(authorEmail, subscriptionId) >> webhookSubscription
        1 * this.hermesService.getSubscriptionEventHistory(authorEmail, subscriptionId, "DEPLOY", null, null, null, pageRequest) >> response
        notThrown()
    }

    def "when trying to get subscription event history and is wrong workspace should throw not found exception"() {
        given:
        def pageRequest = new PageRequest()

        when:
        eventHistoryWebhookSubscriptionInteractor.execute("workspaceIdOther", authorization, null, subscriptionId, "DEPLOY", null, null, null, pageRequest)

        then:
        1 * this.managementUserSecurityService.getUserEmail(authorization) >> authorEmail
        1 * this.userRepository.findByEmail(authorEmail) >> Optional.of(author)
        1 * this.hermesService.getSubscription(authorEmail, subscriptionId) >> webhookSubscription
        0 * this.hermesService.getSubscriptionEventHistory(authorEmail, subscriptionId, "DEPLOY", null, null, null, pageRequest)
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

    private static User getAuthor() {
        return new User("f52f94b8-6775-470f-bac8-125ebfd6b636", "charlescd", authorEmail, "http://image.com.br/photo.png",
                [], false, LocalDateTime.now())
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

    private static WebhookSubscription getWebhookSubscription() {
        return new WebhookSubscription('subscriptionId', 'https://mywebhook.com.br', 'apiKey', 'workspaceId',
                'My Webhook', events)
    }
}
