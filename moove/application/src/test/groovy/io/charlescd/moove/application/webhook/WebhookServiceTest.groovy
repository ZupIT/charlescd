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

package io.charlescd.moove.application.webhook

import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.WebhookService
import io.charlescd.moove.domain.SimpleWebhookSubscription
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.WebhookSubscription
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.service.HermesService
import io.charlescd.moove.domain.service.ManagementUserSecurityService
import spock.lang.Specification

import java.time.LocalDateTime

class WebhookServiceTest extends Specification {

    private WebhookService webhookService

    private HermesService hermesService = Mock(HermesService)
    private UserRepository userRepository = Mock(UserRepository)
    private ManagementUserSecurityService managementUserSecurityService = Mock(ManagementUserSecurityService)

    void setup() {
        this.webhookService = new WebhookService(hermesService,   new UserService(userRepository, managementUserSecurityService),)
    }

    def "when create webhook subscription should not throw"() {
        given:
        def subscription = new WebhookSubscription( 'https://mywebhook.com.br', 'secret', 'workspaceId',
                'My Webhook', events)

        when:
        this.webhookService.subscribe(authorization, subscription)

        then:
        1 * managementUserSecurityService.getUserEmail(authorization) >> authorEmail
        0 * userRepository.findByEmail(authorEmail) >> Optional.of(author)
        1 * this.hermesService.subscribe(authorEmail, subscription) >> "subscriptionId"

        notThrown()
    }

    def "when get webhook subscription should not throw"() {
        when:
        this.webhookService.getSubscription(workspaceId, authorization, subscriptionId)

        then:
        1 * managementUserSecurityService.getUserEmail(authorization) >> authorEmail
        1 * userRepository.findByEmail(authorEmail) >> Optional.of(author)
        1 * hermesService.getSubscription(authorEmail, subscriptionId) >> simpleWebhookSubscription

        notThrown()
    }

    def "when get webhook subscription and author not root and workspaceId is wrong, should throw NotFoundException"() {
        when:
        this.webhookService.getSubscription("workspaceIdOther", authorization, subscriptionId)

        then:
        1 * managementUserSecurityService.getUserEmail(authorization) >> authorEmail
        1 * userRepository.findByEmail(authorEmail) >> Optional.of(author)
        1 * hermesService.getSubscription(authorEmail, subscriptionId) >> simpleWebhookSubscription

        thrown(NotFoundException)
    }

    def "when update webhook subscription should not throw"() {
        when:
        this.webhookService.updateSubscription(workspaceId, authorization, subscriptionId, events)

        then:
        1 * managementUserSecurityService.getUserEmail(authorization) >> authorEmail
        1 * userRepository.findByEmail(authorEmail) >> Optional.of(author)
        1 * hermesService.getSubscription(authorEmail, subscriptionId) >> simpleWebhookSubscription

        notThrown()
    }

    def "when update webhook subscription and workspaceId is wrong, should not update and throw NotFoundException"() {
        when:
        this.webhookService.getSubscription("workspaceIdOther", authorization, subscriptionId)

        then:
        1 * managementUserSecurityService.getUserEmail(authorization) >> authorEmail
        1 * userRepository.findByEmail(authorEmail) >> Optional.of(author)
        1 * hermesService.getSubscription(authorEmail, subscriptionId) >> simpleWebhookSubscription

        thrown(NotFoundException)
    }

    def "when delete webhook subscription should not throw"() {
        when:
        this.webhookService.deleteSubscription(workspaceId, authorization, subscriptionId)

        then:
        1 * managementUserSecurityService.getUserEmail(authorization) >> authorEmail
        1 * userRepository.findByEmail(authorEmail) >> Optional.of(author)
        1 * hermesService.getSubscription(authorEmail, subscriptionId) >> simpleWebhookSubscription

        notThrown()
    }

    def "when delete webhook subscription and workspaceId is wrong, should not update and throw NotFoundException"() {
        when:
        this.webhookService.deleteSubscription("workspaceIdOther", authorization, subscriptionId)

        then:
        1 * managementUserSecurityService.getUserEmail(authorization) >> authorEmail
        1 * userRepository.findByEmail(authorEmail) >> Optional.of(author)
        1 * hermesService.getSubscription(authorEmail, subscriptionId) >> simpleWebhookSubscription

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

    private static SimpleWebhookSubscription getSimpleWebhookSubscription() {
        return new SimpleWebhookSubscription('https://mywebhook.com.br', workspaceId,
                'My Webhook', events)
    }
}
