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
import io.charlescd.moove.application.webhook.DeleteWebhookSubscriptionInteractor
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.WebhookSubscription
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.service.HermesService
import io.charlescd.moove.domain.service.ManagementUserSecurityService
import spock.lang.Specification

import java.time.LocalDateTime

class DeleteWebhookSubscriptionInteractorImplTest extends Specification {

    private DeleteWebhookSubscriptionInteractor deleteWebhookSubscriptionInteractor
    private HermesService hermesService = Mock(HermesService)
    private UserRepository userRepository = Mock(UserRepository)
    private ManagementUserSecurityService managementUserSecurityService = Mock(ManagementUserSecurityService)

    def setup() {
        deleteWebhookSubscriptionInteractor = new DeleteWebhookSubscriptionInteractorImpl(new WebhookService(new UserService(userRepository, managementUserSecurityService)), hermesService)
    }

    def "when trying to delete subscription should do it successfully"() {
        when:
        deleteWebhookSubscriptionInteractor.execute(workspaceId, authorization, subscriptionId)

        then:
        1 * this.managementUserSecurityService.getUserEmail(authorization) >> authorEmail
        1 * this.userRepository.findByEmail(authorEmail) >> Optional.of(author)
        1 * this.hermesService.getSubscription(authorEmail, subscriptionId) >> webhookSubscription
        1 * this.hermesService.deleteSubscription(authorEmail, subscriptionId)
        notThrown()
    }

    def "when trying to delete subscription and is wrong workspace should throw not found exception"() {
        when:
        deleteWebhookSubscriptionInteractor.execute("workspaceIdOther", authorization, subscriptionId)

        then:
        1 * this.managementUserSecurityService.getUserEmail(authorization) >> authorEmail
        1 * this.userRepository.findByEmail(authorEmail) >> Optional.of(author)
        1 * this.hermesService.getSubscription(authorEmail, subscriptionId) >> webhookSubscription
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
        return new WebhookSubscription("subscriptionId", "https://mywebhook.com.br", "apiKey","workspaceId",
                "My Webhook", events)
    }
}
