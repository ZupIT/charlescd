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
import io.charlescd.moove.domain.WebhookSubscriptionHealthCheck
import io.charlescd.moove.domain.SimpleWebhookSubscription
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.WebhookSubscription
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.service.ManagementUserSecurityService
import spock.lang.Specification

import java.time.LocalDateTime

class WebhookServiceTest extends Specification {

    private WebhookService webhookService

    private UserRepository userRepository = Mock(UserRepository)
    private ManagementUserSecurityService managementUserSecurityService = Mock(ManagementUserSecurityService)

    void setup() {
        this.webhookService = new WebhookService(new UserService(userRepository, managementUserSecurityService))
    }

    def "when trying to get author should do it successfully"() {
        given:
        def author = getAuthor(false)

        when:
        webhookService.getAuthor(authorization)

        then:
        1 * this.managementUserSecurityService.getUserEmail(authorization) >> authorEmail
        1 * this.userRepository.findByEmail(authorEmail) >> Optional.of(author)
        notThrown()
    }

    def "when trying to get author email should do it successfully"() {
        given:
        def author = getAuthor(false)

        when:
        webhookService.getAuthorEmail(authorization)

        then:
        1 * this.managementUserSecurityService.getUserEmail(authorization) >> authorEmail
        0 * this.userRepository.findByEmail(authorEmail) >> Optional.of(author)
        notThrown()
    }

    def "when trying to access subscription as user root should do it successfully"() {
        given:
        def author = getAuthor(true)

        when:
        webhookService.validateWorkspace("OtherWorkspaceId", subscriptionId,  author, webhookSubscription)

        then:
        notThrown()
    }

    def "when trying to access subscription as user  not root with other workspace should do throw NotFoundException"() {
        given:
        def author = getAuthor(false)

        when:
        webhookService.validateWorkspace("OtherWorkspaceId", subscriptionId,  author, webhookSubscription)

        then:
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

    private static User getAuthor(boolean root) {
       return new User("f52f94b8-6775-470f-bac8-125ebfd6b636", "charlescd", authorEmail, "http://image.com.br/photo.png",
                [], root, LocalDateTime.now())
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
        return new SimpleWebhookSubscription('https://mywebhook.com.br'," apiKey", workspaceId,
                'My Webhook', events)
    }

    private static WebhookSubscription getWebhookSubscription() {
        return new WebhookSubscription("subscriptionId",'https://mywebhook.com.br'," apiKey", workspaceId,
                'My Webhook', events)
    }

    private static WebhookSubscriptionHealthCheck getHealthCheckWebhookSubscription() {
        return new WebhookSubscriptionHealthCheck(500, "Unexpected error")
    }
}
